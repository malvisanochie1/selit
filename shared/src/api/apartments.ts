import { toApiError } from '../errors';
import type { Apartment, ApartmentAction, ApartmentFilters, ApartmentInput } from '../types';
import type { Paginated } from '../utils/pagination';
import { pageRange, pagination, searchTerm, unwrap, type ApiContext } from './context';
import { APARTMENT_COLUMNS, mapApartment } from './mappers';

export function apartmentsApi(ctx: ApiContext) {
  const { client } = ctx;

  async function get(id: string): Promise<Apartment> {
    const row = unwrap(
      await client.from('apartments').select(APARTMENT_COLUMNS).eq('id', id).maybeSingle(),
    );
    return mapApartment(ctx, row);
  }

  async function feedback(id: string, kind: 'confirm-real' | 'report-taken') {
    const userId = await ctx.requireUserId();
    const { error } = await client
      .from('apartment_feedback')
      .insert({ apartment_id: id, user_id: userId, kind });
    // Tapping twice is fine; the first tap already counted.
    if (error && (error as { code?: string }).code !== '23505') throw toApiError(error);
  }

  return {
    get,

    async list(filters: ApartmentFilters = {}): Promise<Paginated<Apartment>> {
      const { page, limit, from, to } = pageRange(filters.page, filters.limit ?? 9);
      let query = client.from('apartments').select(APARTMENT_COLUMNS, { count: 'exact' });

      if (!(filters.includeAll && filters.agentId))
        query = query.in('status', ['available', 'taken']);
      if (filters.agentId) query = query.eq('agent_id', filters.agentId);
      if (filters.school) query = query.eq('school', filters.school);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.priceMax) query = query.lte('rent_per_year', filters.priceMax);

      const term = searchTerm(filters.search);
      if (term)
        query = query.or(`title.ilike.%${term}%,area.ilike.%${term}%,description.ilike.%${term}%`);

      // Available places first, then the chosen order.
      query = query.order('status', { ascending: true });
      if (filters.sort === 'price_asc' || filters.sort === 'price_desc') {
        query = query.order('rent_per_year', { ascending: filters.sort === 'price_asc' });
      }
      query = query.order('last_renewed_at', { ascending: false });

      const { data, count, error } = await query.range(from, to);
      if (error) throw toApiError(error);
      return {
        items: (data ?? []).map((row) => mapApartment(ctx, row)),
        pagination: pagination(count ?? 0, page, limit),
      };
    },

    async create(input: ApartmentInput): Promise<Apartment> {
      const agentId = await ctx.requireUserId();
      const paths: string[] = [];
      for (const photo of input.photos) paths.push(await ctx.upload('apartment-photos', photo));

      const { data, error } = await client
        .from('apartments')
        .insert({
          agent_id: agentId,
          agency_name: input.agencyName.trim(),
          title: input.title.trim(),
          description: input.description.trim(),
          type: input.type,
          rent_per_year: input.rentPerYear,
          agency_fee: input.agencyFee,
          caution_fee: input.cautionFee,
          school: input.school,
          area: input.area.trim(),
          distance_to_campus: input.distanceToCampus.trim(),
          amenities: input.amenities,
          photo_paths: paths,
        })
        .select(APARTMENT_COLUMNS)
        .single();
      if (error) {
        await ctx.remove('apartment-photos', paths);
        throw toApiError(error);
      }
      return mapApartment(ctx, data);
    },

    async remove(id: string) {
      const current = await get(id);
      const { error } = await client.from('apartments').delete().eq('id', id);
      if (error) throw toApiError(error);
      await ctx.remove('apartment-photos', current.imagePaths);
    },

    /** Freshness and trust signals: agents renew, visitors flag "taken" or confirm the place is real. */
    async sendAction(id: string, action: ApartmentAction): Promise<Apartment> {
      if (action === 'renew') {
        const { error } = await client.rpc('renew_apartment', { p_apartment: id });
        if (error) throw toApiError(error);
      } else if (action === 'mark-taken' || action === 'mark-available') {
        const status = action === 'mark-taken' ? 'taken' : 'available';
        const { error } = await client.from('apartments').update({ status }).eq('id', id);
        if (error) throw toApiError(error);
      } else {
        await feedback(id, action);
      }
      return get(id);
    },

    async recordView(id: string) {
      await client.rpc('record_apartment_view', { p_apartment: id });
    },
  };
}
