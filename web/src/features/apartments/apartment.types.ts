import type { ApartmentType } from '@selit/shared';
export type {
  Apartment,
  ApartmentAction,
  ApartmentAgent,
  ApartmentFilters,
  ApartmentStatus,
  ApartmentType,
} from '@selit/shared';

/** What the apartment form collects in the browser, before photos are compressed. */
export type ApartmentInput = {
  title: string;
  description: string;
  type: ApartmentType;
  rentPerYear: number;
  agencyFee: number;
  cautionFee: number;
  agencyName: string;
  school: string;
  area: string;
  distanceToCampus: string;
  amenities: string[];
  photos: File[];
};
