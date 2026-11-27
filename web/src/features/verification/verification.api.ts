import type { IdType } from '@selit/shared';

import { getApi } from '@/lib/api';
import { toPhotoUpload, toPhotoUploads } from '@/lib/photos';

export { ID_TYPES } from '@selit/shared';
export type { IdType, VerificationRecord } from '@selit/shared';

export type VerificationSubmission = {
  idType: IdType;
  idNumber: string;
  idPhoto: File;
  selfies: File[];
};

export function getMyVerification() {
  return getApi().verification.mine();
}

/** Sends the ID photo and live selfie frames privately. The server makes every decision. */
export async function submitVerification(submission: VerificationSubmission) {
  return getApi().verification.submit({
    idType: submission.idType,
    idNumber: submission.idNumber.trim(),
    idPhoto: await toPhotoUpload(submission.idPhoto, 1600),
    selfies: await toPhotoUploads(submission.selfies, 900),
  });
}
