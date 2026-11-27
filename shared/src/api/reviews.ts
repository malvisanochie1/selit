import { toApiError } from '../errors';
import type { Review, ReviewInput, SellerReviews } from '../types';
import { unwrap, type ApiContext } from './context';
import { mapReview } from './mappers';

const REVIEW_COLUMNS = '*, reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, avatar_path)';

export function reviewsApi(ctx: ApiContext) {
  const { client } = ctx;

  async function reactedIds(reviewIds: string[]) {
    const userId = await ctx.currentUserId();
    if (!userId || !reviewIds.length) return new Set<string>();
    const { data } = await client
      .from('review_reactions')
      .select('review_id')
      .eq('user_id', userId)
      .in('review_id', reviewIds);
    return new Set((data ?? []).map((row) => row.review_id as string));
  }

  async function getOne(id: string): Promise<Review> {
    const row = unwrap(await client.from('reviews').select(REVIEW_COLUMNS).eq('id', id).single());
    return mapReview(ctx, row, await reactedIds([id]));
  }

  return {
    async forSeller(sellerId: string): Promise<SellerReviews> {
      const [reviews, seller] = await Promise.all([
        client
          .from('reviews')
          .select(REVIEW_COLUMNS)
          .eq('seller_id', sellerId)
          .order('created_at', { ascending: false })
          .limit(100),
        client
          .from('profiles')
          .select('rating_average, review_count')
          .eq('id', sellerId)
          .maybeSingle(),
      ]);
      if (reviews.error) throw toApiError(reviews.error);
      const rows = reviews.data ?? [];
      const reacted = await reactedIds(rows.map((row) => row.id as string));
      return {
        averageRating: Number(seller.data?.rating_average ?? 0),
        reviewCount: Number(seller.data?.review_count ?? rows.length),
        reviews: rows.map((row) => mapReview(ctx, row, reacted)),
      };
    },

    async create(sellerId: string, input: ReviewInput): Promise<Review> {
      const reviewerId = await ctx.requireUserId();
      const { data, error } = await client
        .from('reviews')
        .insert({
          seller_id: sellerId,
          reviewer_id: reviewerId,
          rating: input.rating,
          comment: input.comment.trim(),
        })
        .select(REVIEW_COLUMNS)
        .single();
      if (error) {
        const code = (error as { code?: string }).code;
        if (code === '23514') throw toApiError({ message: 'forbidden' });
        if (code === '23505') throw toApiError({ code, message: '' });
        throw toApiError(error);
      }
      return mapReview(ctx, data, new Set());
    },

    async reply(reviewId: string, reply: string): Promise<Review> {
      const { error } = await client
        .from('reviews')
        .update({ seller_reply: reply.trim() || null })
        .eq('id', reviewId);
      if (error) throw toApiError(error);
      return getOne(reviewId);
    },

    async toggleHelpful(reviewId: string) {
      const userId = await ctx.requireUserId();
      const reacted = (await reactedIds([reviewId])).has(reviewId);
      const result = reacted
        ? await client
            .from('review_reactions')
            .delete()
            .eq('review_id', reviewId)
            .eq('user_id', userId)
        : await client.from('review_reactions').insert({ review_id: reviewId, user_id: userId });
      if (result.error) throw toApiError(result.error);
      const { data } = await client
        .from('reviews')
        .select('helpful_count')
        .eq('id', reviewId)
        .single();
      return { reacted: !reacted, reactionCount: Number(data?.helpful_count ?? 0) };
    },

    async remove(reviewId: string) {
      const { error } = await client.from('reviews').delete().eq('id', reviewId);
      if (error) throw toApiError(error);
    },
  };
}
