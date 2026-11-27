export type {
  Listing,
  ListingFilters,
  ListingSeller,
  ListingSort,
  ListingStatus,
} from '@selit/shared';

/** What the sell form collects in the browser, before photos are compressed. */
export type ListingInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  school: string;
  location: string;
  /** URLs of photos kept from the listing being edited. */
  existingImages: string[];
  newPhotos: File[];
  /** Proof-of-item check: the issued code and a photo of the item beside it. */
  checkId?: string;
  checkPhoto?: File;
};

/** Item checks only apply to new listings, so edits never carry one. */
export type ListingUpdate = Partial<Omit<ListingInput, 'checkId' | 'checkPhoto'>> & {
  status?: 'active' | 'sold';
};
