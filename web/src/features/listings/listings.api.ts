import { getApi } from '@/lib/api';
import { toPhotoUpload, toPhotoUploads } from '@/lib/photos';

import type { Listing, ListingFilters, ListingInput, ListingUpdate } from './listing.types';

/** Photos kept while editing are sent back as their stored paths. */
function pathsFor(listing: Listing, urls: string[]) {
  return urls.map((url) => listing.imagePaths[listing.images.indexOf(url)] ?? url);
}

export function listListings(filters: ListingFilters = {}) {
  return getApi().listings.list(filters);
}

export function getListing(id: string) {
  return getApi().listings.get(id);
}

export async function createListing(input: ListingInput) {
  const { existingImages, newPhotos, checkPhoto, ...fields } = input;
  return getApi().listings.create({
    ...fields,
    existingImagePaths: existingImages,
    newPhotos: await toPhotoUploads(newPhotos),
    checkPhoto: checkPhoto ? await toPhotoUpload(checkPhoto) : undefined,
  });
}

export async function updateListing(id: string, update: ListingUpdate) {
  const { existingImages, newPhotos, ...fields } = update;
  const api = getApi();
  const current = existingImages ? await api.listings.get(id) : null;
  return api.listings.update(id, {
    ...fields,
    existingImagePaths: current && existingImages ? pathsFor(current, existingImages) : undefined,
    newPhotos: newPhotos ? await toPhotoUploads(newPhotos) : undefined,
  });
}

export function deleteListing(id: string) {
  return getApi().listings.remove(id);
}

export function recordListingView(id: string) {
  return getApi().listings.recordView(id);
}
