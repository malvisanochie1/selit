import { toApiError } from '../errors';
import type { CheckCode, Listing, ListingFilters, ListingInput, ListingUpdate } from '../types';
import type { Paginated } from '../utils/pagination';
import { pageRange, pagination, searchTerm, unwrap, type ApiContext } from './context';
import { LISTING_COLUMNS, mapListing } from './mappers';

export function listingsApi(ctx: ApiContext) {
  const { client } = ctx;

  async function get(id: string): Promise<Listing> {
    const row = unwrap(
      await client.from('listings').select(LISTING_COLUMNS).eq('id', id).maybeSingle(),
    );
    return mapListing(ctx, row);
  }

  async function uploadAll(photos: ListingInput['newPhotos'] = []) {
    const paths: string[] = [];
    for (const photo of photos) paths.push(await ctx.upload('listing-photos', photo));
    return paths;
  }

  return {
    get,

    async list(filters: ListingFilters = {}): Promise<Paginated<Listing>> {
      const { page, limit, from, to } = pageRange(filters.page, filters.limit ?? 12);
      let query = client.from('listings').select(LISTING_COLUMNS, { count: 'exact' });

      const status = filters.status ?? 'active';
      if (status !== 'all') query = query.eq('status', status);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.school) query = query.eq('school', filters.school);
      if (filters.condition) query = query.eq('condition', filters.condition);
      if (filters.sellerId) query = query.eq('seller_id', filters.sellerId);
      if (filters.priceMin !== undefined) query = query.gte('price', filters.priceMin);
      if (filters.priceMax !== undefined) query = query.lte('price', filters.priceMax);

      const term = searchTerm(filters.search);
      if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);

      const sort = filters.sort ?? 'newest';
      if (sort === 'price_asc' || sort === 'price_desc') {
        query = query.order('price', { ascending: sort === 'price_asc' });
      }
      query = query.order('created_at', { ascending: sort === 'oldest' });

      const { data, count, error } = await query.range(from, to);
      if (error) throw toApiError(error);
      return {
        items: (data ?? []).map((row) => mapListing(ctx, row)),
        pagination: pagination(count ?? 0, page, limit),
      };
    },

    async create(input: ListingInput): Promise<Listing> {
      const sellerId = await ctx.requireUserId();
      const photoPaths = [...input.existingImagePaths, ...(await uploadAll(input.newPhotos))];

      // The item-check photo is named after its code so the database can find it.
      if (input.checkId && input.checkPhoto) {
        await ctx.upload('listing-checks', input.checkPhoto, input.checkId);
      }

      const { data, error } = await client
        .from('listings')
        .insert({
          seller_id: sellerId,
          title: input.title.trim(),
          description: input.description.trim(),
          price: input.price,
          category: input.category,
          condition: input.condition,
          school: input.school,
          meetup_spot: input.location.trim(),
          photo_paths: photoPaths,
          check_id: input.checkId && input.checkPhoto ? input.checkId : null,
        })
        .select(LISTING_COLUMNS)
        .single();
      if (error) {
        await ctx.remove(
          'listing-photos',
          photoPaths.filter((path) => !input.existingImagePaths.includes(path)),
        );
        throw toApiError(error);
      }
      return mapListing(ctx, data);
    },

    async update(id: string, update: ListingUpdate): Promise<Listing> {
      const current = await get(id);
      const changes: Record<string, unknown> = {};
      if (update.title !== undefined) changes.title = update.title.trim();
      if (update.description !== undefined) changes.description = update.description.trim();
      if (update.price !== undefined) changes.price = update.price;
      if (update.category !== undefined) changes.category = update.category;
      if (update.condition !== undefined) changes.condition = update.condition;
      if (update.school !== undefined) changes.school = update.school;
      if (update.location !== undefined) changes.meetup_spot = update.location.trim();
      if (update.status !== undefined) changes.status = update.status;

      let removed: string[] = [];
      if (update.existingImagePaths || update.newPhotos?.length) {
        const kept = update.existingImagePaths ?? current.imagePaths;
        changes.photo_paths = [...kept, ...(await uploadAll(update.newPhotos))];
        removed = current.imagePaths.filter((path) => !kept.includes(path));
      }

      const { data, error } = await client
        .from('listings')
        .update(changes)
        .eq('id', id)
        .select(LISTING_COLUMNS)
        .single();
      if (error) throw toApiError(error);
      await ctx.remove('listing-photos', removed);
      return mapListing(ctx, data);
    },

    async remove(id: string) {
      const current = await get(id);
      const { error } = await client.from('listings').delete().eq('id', id);
      if (error) throw toApiError(error);
      await ctx.remove('listing-photos', current.imagePaths);
    },

    async recordView(id: string) {
      await client.rpc('record_listing_view', { p_listing: id });
    },

    /**
     * A short one-time code the seller writes on paper and photographs beside
     * the item. Only the server issues and checks codes.
     */
    async requestCheckCode(): Promise<CheckCode> {
      const { data, error } = await client.rpc('issue_listing_check');
      if (error) throw toApiError(error);
      const row = (Array.isArray(data) ? data[0] : data) as {
        id: string;
        code: string;
        expires_at: string;
      };
      return { id: row.id, code: row.code, expiresAt: row.expires_at };
    },
  };
}
