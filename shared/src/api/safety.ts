import { toApiError } from '../errors';
import type { ReportInput, VerificationRecord, VerificationSubmission } from '../types';
import type { ApiContext } from './context';

export function reportsApi(ctx: ApiContext) {
  return {
    async submit(input: ReportInput) {
      const reporterId = await ctx.requireUserId();
      const { data, error } = await ctx.client
        .from('reports')
        .insert({
          reporter_id: reporterId,
          target_type: input.targetType,
          target_id: input.targetId,
          reason: input.reason,
          details: input.details.trim(),
        })
        .select('id')
        .single();
      if (error) {
        if ((error as { code?: string }).code === '23505') return { id: 'existing' };
        throw toApiError(error);
      }
      return { id: data.id as string };
    },
  };
}

export function verificationApi(ctx: ApiContext) {
  const { client } = ctx;

  async function mine(): Promise<VerificationRecord> {
    const userId = await ctx.requireUserId();
    const [profile, latest] = await Promise.all([
      client.from('profiles').select('verification_status').eq('id', userId).single(),
      client
        .from('verifications')
        .select('created_at, status, review_note')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    if (profile.error) throw toApiError(profile.error);
    const status = profile.data.verification_status as VerificationRecord['status'];
    return {
      status,
      submittedAt: (latest.data?.created_at as string | undefined) ?? null,
      // Notes about matching IDs are for reviewers only; members only see rejection notes.
      reviewNote:
        status === 'rejected' ? ((latest.data?.review_note as string | null) ?? null) : null,
    };
  }

  return {
    mine,

    /** Uploads the ID photo and live selfie frames privately. The server makes every decision. */
    async submit(submission: VerificationSubmission): Promise<VerificationRecord> {
      const uploaded: string[] = [];
      try {
        const idPhotoPath = await ctx.upload('verifications', submission.idPhoto);
        uploaded.push(idPhotoPath);
        const selfiePaths: string[] = [];
        for (const selfie of submission.selfies.slice(0, 3)) {
          const path = await ctx.upload('verifications', selfie);
          uploaded.push(path);
          selfiePaths.push(path);
        }
        const { error } = await client.rpc('submit_verification', {
          p_id_type: submission.idType,
          p_id_number: submission.idNumber,
          p_id_photo_path: idPhotoPath,
          p_selfie_paths: selfiePaths,
        });
        if (error) throw toApiError(error);
      } catch (error) {
        await ctx.remove('verifications', uploaded);
        throw toApiError(error);
      }
      return mine();
    },
  };
}
