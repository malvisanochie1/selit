import { getApi } from '@/lib/api';
import { toPhotoUploads } from '@/lib/photos';

import type { ApartmentAction, ApartmentFilters, ApartmentInput } from './apartment.types';

export function listApartments(filters: ApartmentFilters = {}) {
  return getApi().apartments.list(filters);
}

export function getApartment(id: string) {
  return getApi().apartments.get(id);
}

export async function createApartment(input: ApartmentInput) {
  const { photos, ...fields } = input;
  return getApi().apartments.create({ ...fields, photos: await toPhotoUploads(photos) });
}

/** Freshness and trust signals: agents renew, visitors flag "taken" or confirm the place is real. */
export function sendApartmentAction(id: string, action: ApartmentAction) {
  return getApi().apartments.sendAction(id, action);
}

export function recordApartmentView(id: string) {
  return getApi().apartments.recordView(id);
}
