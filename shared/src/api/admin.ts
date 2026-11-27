import { toApiError } from '../errors';
import type {
  AccountStatus,
  AdminStats,
  AdminUser,
  Apartment,
  ApartmentStatus,
  CategoryStat,
  Listing,
  ModeratedListingStatus,
  Report,
  ReportStatus,
  ReportTarget,
  UserRole,
  VerificationRequest,
} from '../types';
import type { Paginated } from '../utils/pagination';
import { pageRange, pagination, type ApiContext } from './context';
import { APARTMENT_COLUMNS, LISTING_COLUMNS, mapApartment, mapListing, num, text } from './mappers';
import type { IdType } from '../catalog/verification';
import type { ReportReason } from '../catalog/reports';

const PAGE_SIZE = 20;
type Row = Record<string, unknown>;
type ListResult = { total: number; items: Row[] };

export function adminApi(ctx: ApiContext) {
  const { client } = ctx;

  async function rpc<T>(name: string, args: Record<string, unknown> = {}) {
    const { data, error } = await client.rpc(name, args);
    if (error) throw toApiError(error);
    return data as T;
  }

  return {
    stats: () => rpc<AdminStats>('admin_overview'),

    async listings(
      status: ModeratedListingStatus | 'all',
      page: number,
    ): Promise<Paginated<Listing>> {
      const range = pageRange(page, PAGE_SIZE);
      let query = client.from('listings').select(LISTING_COLUMNS, { count: 'exact' });
      if (status !== 'all') query = query.eq('status', status);
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(range.from, range.to);
      if (error) throw toApiError(error);
      return {
        items: (data ?? []).map((row) => mapListing(ctx, row)),
        pagination: pagination(count ?? 0, range.page, range.limit),
      };
    },

    setListingStatus: (id: string, status: ModeratedListingStatus, reason?: string) =>
      rpc<void>('moderate_listing', { p_listing: id, p_status: status, p_reason: reason ?? null }),

    async apartments(status: ApartmentStatus | 'all', page: number): Promise<Paginated<Apartment>> {
      const range = pageRange(page, PAGE_SIZE);
      let query = client.from('apartments').select(APARTMENT_COLUMNS, { count: 'exact' });
      if (status !== 'all') query = query.eq('status', status);
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(range.from, range.to);
      if (error) throw toApiError(error);
      return {
        items: (data ?? []).map((row) => mapApartment(ctx, row)),
        pagination: pagination(count ?? 0, range.page, range.limit),
      };
    },

    setApartmentStatus: (id: string, status: ApartmentStatus, confirmed?: boolean) =>
      rpc<void>('moderate_apartment', {
        p_apartment: id,
        p_status: status,
        p_confirmed: confirmed ?? null,
      }),

    async users(filters: {
      role?: UserRole;
      status?: AccountStatus;
      search?: string;
      page: number;
    }): Promise<Paginated<AdminUser>> {
      const range = pageRange(filters.page, PAGE_SIZE);
      const result = await rpc<ListResult>('admin_list_members', {
        p_role: filters.role ?? null,
        p_status: filters.status ?? null,
        p_search: filters.search ?? null,
        p_page: range.page,
        p_limit: range.limit,
      });
      return {
        items: result.items.map((row) => ({
          id: text(row.id),
          email: text(row.email),
          fullName: text(row.full_name, 'Unnamed member'),
          campusLocation: text(row.school),
          role: (row.role as UserRole) ?? 'buyer',
          status: (row.status as AccountStatus) ?? 'active',
          verificationStatus:
            (row.verification_status as AdminUser['verificationStatus']) ?? 'unverified',
          profileImageUrl: ctx.publicUrl('avatars', text(row.avatar_path)),
          createdAt: text(row.created_at),
        })),
        pagination: pagination(result.total, range.page, range.limit),
      };
    },

    setUserStatus: (id: string, status: AccountStatus) =>
      rpc<void>('set_account_status', { p_user: id, p_status: status }),

    async categoryStats(): Promise<CategoryStat[]> {
      const rows = await rpc<Row[]>('admin_category_stats');
      return rows.map((row) => ({
        slug: text(row.slug),
        name: text(row.name),
        total: num(row.total),
        active: num(row.active),
        pending: num(row.pending),
        status: row.is_paused === true ? 'paused' : 'active',
      }));
    },

    async setCategoryStatus(slug: string, status: CategoryStat['status']) {
      const { error } = await client
        .from('categories')
        .update({ is_paused: status === 'paused' })
        .eq('slug', slug);
      if (error) throw toApiError(error);
    },

    async reports(filters: {
      target: ReportTarget;
      status?: ReportStatus;
      page: number;
    }): Promise<Paginated<Report>> {
      const range = pageRange(filters.page, PAGE_SIZE);
      const result = await rpc<ListResult>('admin_list_reports', {
        p_target: filters.target,
        p_status: filters.status ?? null,
        p_page: range.page,
        p_limit: range.limit,
      });
      return {
        items: result.items.map((row) => ({
          id: text(row.id),
          targetType: row.target_type as ReportTarget,
          targetId: text(row.target_id),
          targetTitle: text(row.target_title),
          reason: row.reason as ReportReason,
          details: text(row.details),
          status: row.status as ReportStatus,
          reporterName: text(row.reporter_name),
          createdAt: text(row.created_at),
        })),
        pagination: pagination(result.total, range.page, range.limit),
      };
    },

    setReportStatus: (report: Report, status: ReportStatus) =>
      rpc<void>('resolve_report', { p_report: report.id, p_status: status }),

    /** ID and selfie photos are private; admins get links that expire after ten minutes. */
    async verifications(page: number): Promise<Paginated<VerificationRequest>> {
      const range = pageRange(page, PAGE_SIZE);
      const result = await rpc<ListResult>('admin_list_verifications', {
        p_page: range.page,
        p_limit: range.limit,
      });
      const paths = result.items
        .flatMap((row) => [text(row.id_photo_path), ...((row.selfie_paths as string[]) ?? [])])
        .filter(Boolean);
      const signed = new Map<string, string>();
      if (paths.length) {
        const { data } = await client.storage.from('verifications').createSignedUrls(paths, 600);
        for (const entry of data ?? [])
          if (entry.path && entry.signedUrl) signed.set(entry.path, entry.signedUrl);
      }
      return {
        items: result.items.map((row) => ({
          id: text(row.id),
          userId: text(row.user_id),
          fullName: text(row.full_name),
          email: text(row.email),
          idType: row.id_type as IdType,
          idNumberLast4: text(row.id_number_last4),
          idPhotoUrl: signed.get(text(row.id_photo_path)) ?? '',
          selfieUrls: ((row.selfie_paths as string[]) ?? [])
            .map((path) => signed.get(path) ?? '')
            .filter(Boolean),
          warning: typeof row.review_note === 'string' ? row.review_note : null,
          submittedAt: text(row.created_at),
          status: 'pending' as const,
        })),
        pagination: pagination(result.total, range.page, range.limit),
      };
    },

    /** Records the decision, then deletes the ID and selfie photos for good. */
    async decideVerification(id: string, decision: 'verified' | 'rejected', note: string) {
      const paths = await rpc<string[]>('decide_verification', {
        p_verification: id,
        p_approve: decision === 'verified',
        p_note: note,
      });
      await ctx.remove('verifications', paths ?? []);
    },
  };
}
