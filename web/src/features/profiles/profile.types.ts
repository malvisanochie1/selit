export type { PublicProfile } from '@selit/shared';

export type ProfileUpdateInput = {
  fullName?: string;
  campusLocation?: string;
  department?: string;
  bio?: string;
  whatsApp?: string;
  image?: File | null;
};
