import { toApiError } from '../errors';
import type { PhotoUpload, PublicProfile, SessionUser } from '../types';
import { toInternationalNumber } from '../utils/phone';
import { unwrap, type ApiContext } from './context';
import { MEMBER_COLUMNS, mapPublicProfile, mapSessionUser } from './mappers';

export type ProfileUpdateInput = {
  fullName?: string;
  campusLocation?: string;
  department?: string;
  bio?: string;
  whatsApp?: string;
  image?: PhotoUpload | null;
};

export function profilesApi(ctx: ApiContext) {
  const { client } = ctx;

  async function me(): Promise<SessionUser> {
    const { data } = await client.auth.getUser();
    const id = await ctx.requireUserId();
    const row = unwrap(await client.from('profiles').select(MEMBER_COLUMNS).eq('id', id).single());
    return mapSessionUser(ctx, row, data.user?.email ?? '');
  }

  return {
    me,

    async getPublicProfile(id: string): Promise<PublicProfile> {
      const row = unwrap(
        await client.from('profiles').select(MEMBER_COLUMNS).eq('id', id).maybeSingle(),
      );
      return mapPublicProfile(ctx, row);
    },

    async updateMyProfile(input: ProfileUpdateInput): Promise<SessionUser> {
      const id = await ctx.requireUserId();
      const changes: Record<string, unknown> = {};
      if (input.fullName !== undefined) changes.full_name = input.fullName.trim();
      if (input.campusLocation !== undefined) changes.school = input.campusLocation.trim();
      if (input.department !== undefined) changes.department = input.department.trim();
      if (input.bio !== undefined) changes.bio = input.bio.trim();

      if (input.image) {
        const { data: current } = await client
          .from('profiles')
          .select('avatar_path')
          .eq('id', id)
          .single();
        changes.avatar_path = await ctx.upload('avatars', input.image);
        if (current?.avatar_path) await ctx.remove('avatars', [current.avatar_path]);
      }

      if (Object.keys(changes).length) {
        const { error } = await client.from('profiles').update(changes).eq('id', id);
        if (error) throw toApiError(error);
      }

      if (input.whatsApp !== undefined) {
        const { error } = await client
          .from('profile_contacts')
          .update({ whatsapp: toInternationalNumber(input.whatsApp) })
          .eq('profile_id', id);
        if (error) throw toApiError(error);
      }
      return me();
    },

    /** Selling is open to everyone; the profile just needs the seller flag. */
    async becomeSeller(): Promise<SessionUser> {
      const id = await ctx.requireUserId();
      const { error } = await client.from('profiles').update({ role: 'seller' }).eq('id', id);
      if (error) throw toApiError(error);
      return me();
    },
  };
}
