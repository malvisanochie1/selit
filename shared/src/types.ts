import type { ReportReason } from './catalog/reports';
import type { IdType } from './catalog/verification';

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

export type UserRole = 'buyer' | 'seller' | 'admin';
export type AccountStatus = 'active' | 'watchlist' | 'banned';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  campusLocation: string;
  department: string;
  bio: string;
  whatsApp: string;
  profileImageUrl: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
};

export type PublicProfile = {
  id: string;
  fullName: string;
  campusLocation: string;
  department: string;
  bio: string;
  /** Empty for signed-out visitors: phone numbers are for members only. */
  whatsApp: string;
  profileImageUrl: string;
  role: UserRole;
  averageRating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  createdAt: string;
};

export type SignInInput = { email: string; password: string };

export type SignUpInput = SignInInput & {
  fullName: string;
  accountType: 'buyer' | 'seller';
};

export type SignUpResult = { user: SessionUser | null; needsEmailConfirmation: boolean };

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

/**
 * A photo ready to upload, already compressed by the app. `previewUrl` is only
 * used in sample mode, where nothing is uploaded.
 */
export type PhotoUpload = {
  body: Blob | ArrayBuffer;
  contentType: string;
  previewUrl?: string;
};

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

export type ListingStatus = 'active' | 'sold' | 'pending' | 'rejected' | 'removed';
export type ListingSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc';

export type ListingSeller = {
  id: string;
  fullName: string;
  profileImageUrl: string;
  campusLocation: string;
  whatsApp: string;
  role: UserRole;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
};

export type Listing = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  /** Category slug, e.g. "hostel-items". */
  category: string;
  /** Condition slug, e.g. "like-new". */
  condition: string;
  images: string[];
  /** Stored paths of the photos, kept so edits can reuse them. */
  imagePaths: string[];
  school: string;
  /** The public meet-up spot. */
  location: string;
  status: ListingStatus;
  reviewReason: string | null;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  seller: ListingSeller | null;
};

export type ListingFilters = {
  search?: string;
  category?: string;
  school?: string;
  condition?: string;
  sellerId?: string;
  status?: ListingStatus | 'all';
  priceMin?: number;
  priceMax?: number;
  sort?: ListingSort;
  page?: number;
  limit?: number;
};

export type ListingInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  school: string;
  location: string;
  /** Paths of photos already uploaded (when editing). */
  existingImagePaths: string[];
  newPhotos: PhotoUpload[];
  /** Proof-of-item check: the issued code id and a photo of the item beside it. */
  checkId?: string;
  checkPhoto?: PhotoUpload;
};

export type ListingUpdate = Partial<ListingInput> & { status?: 'active' | 'sold' };

export type CheckCode = { id: string; code: string; expiresAt: string };

// ---------------------------------------------------------------------------
// Apartments
// ---------------------------------------------------------------------------

export type ApartmentType =
  'self-contain' | 'single-room' | 'one-bedroom' | 'two-bedroom' | 'shared';
export type ApartmentStatus = 'available' | 'taken' | 'pending' | 'rejected' | 'removed';

export type ApartmentAgent = {
  id: string;
  fullName: string;
  profileImageUrl: string;
  whatsApp: string;
  agencyName: string;
  isVerified: boolean;
};

export type Apartment = {
  id: string;
  title: string;
  description: string;
  type: ApartmentType;
  rentPerYear: number;
  agencyFee: number;
  cautionFee: number;
  school: string;
  area: string;
  distanceToCampus: string;
  images: string[];
  imagePaths: string[];
  amenities: string[];
  status: ApartmentStatus;
  /** Set when the listing passed photo and identity checks. */
  isConfirmed: boolean;
  /** Visitors who inspected and tapped "This place is real". */
  visitorConfirmations: number;
  lastRenewedAt: string;
  createdAt: string;
  viewsCount: number;
  agent: ApartmentAgent;
};

export type ApartmentFilters = {
  search?: string;
  school?: string;
  type?: ApartmentType;
  priceMax?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
  agentId?: string;
  /** Agents see their own pending and taken listings too. */
  includeAll?: boolean;
};

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
  photos: PhotoUpload[];
};

export type ApartmentAction =
  'renew' | 'mark-taken' | 'mark-available' | 'report-taken' | 'confirm-real';

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export type Review = {
  id: string;
  reviewerId: string;
  sellerId: string;
  rating: number;
  comment: string;
  sellerReply: string | null;
  sellerReplyUpdatedAt: string | null;
  reactionCount: number;
  hasReacted: boolean;
  createdAt: string;
  updatedAt: string;
  reviewer: { id: string; fullName: string; profileImageUrl: string } | null;
};

export type SellerReviews = {
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
};

export type ReviewInput = { rating: number; comment: string };

// ---------------------------------------------------------------------------
// Safety
// ---------------------------------------------------------------------------

export type ReportTarget = 'listing' | 'user' | 'apartment';
export type ReportStatus = 'open' | 'reviewing' | 'actioned' | 'dismissed';

export type ReportInput = {
  targetType: ReportTarget;
  targetId: string;
  reason: ReportReason;
  details: string;
};

export type Report = {
  id: string;
  targetType: ReportTarget;
  targetId: string;
  targetTitle: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  reporterName: string;
  createdAt: string;
};

export type VerificationRecord = {
  status: VerificationStatus;
  submittedAt: string | null;
  reviewNote: string | null;
};

export type VerificationSubmission = {
  idType: IdType;
  idNumber: string;
  idPhoto: PhotoUpload;
  selfies: PhotoUpload[];
};

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export type AdminStats = {
  members: number;
  sellers: number;
  verified: number;
  banned: number;
  activeListings: number;
  soldListings: number;
  pendingListings: number;
  availableApartments: number;
  pendingApartments: number;
  pendingVerifications: number;
  openReports: number;
  newMembersThisWeek: number;
};

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  campusLocation: string;
  role: UserRole;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  profileImageUrl: string;
  createdAt: string;
};

export type CategoryStat = {
  slug: string;
  name: string;
  total: number;
  active: number;
  pending: number;
  status: 'active' | 'paused';
};

export type ModeratedListingStatus = Extract<
  ListingStatus,
  'active' | 'pending' | 'rejected' | 'removed'
>;

export type VerificationRequest = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  idType: IdType;
  idNumberLast4: string;
  idPhotoUrl: string;
  selfieUrls: string[];
  /** Set when the ID matches a banned or already-verified account. */
  warning: string | null;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
};
