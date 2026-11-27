import type {
  AccountStatus,
  Apartment,
  ApartmentStatus,
  ApartmentType,
  Listing,
  ListingSeller,
  ListingStatus,
  PublicProfile,
  Review,
  SessionUser,
  UserRole,
  VerificationStatus,
} from '../types';
import type { ApiContext } from './context';

type Row = Record<string, unknown>;

export function text(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export function num(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function strings(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.length > 0)
    : [];
}

function role(value: unknown): UserRole {
  return value === 'seller' || value === 'admin' ? value : 'buyer';
}

function accountStatus(value: unknown): AccountStatus {
  return value === 'watchlist' || value === 'banned' ? value : 'active';
}

function verification(value: unknown): VerificationStatus {
  return value === 'pending' || value === 'verified' || value === 'rejected' ? value : 'unverified';
}

/** profile_contacts comes back as an object (one-to-one) or null for visitors. */
function whatsAppOf(row: Row) {
  const contact = row.contact as Row | Row[] | null | undefined;
  const value = Array.isArray(contact) ? contact[0] : contact;
  return text(value?.whatsapp);
}

/** Columns to select for a member shown next to a listing, review or apartment. */
export const MEMBER_COLUMNS =
  'id, full_name, avatar_path, school, department, bio, role, status, verification_status, rating_average, review_count, created_at, contact:profile_contacts(whatsapp)';

export const LISTING_COLUMNS = `*, seller:profiles!listings_seller_id_fkey(${MEMBER_COLUMNS})`;
export const APARTMENT_COLUMNS = `*, agent:profiles!apartments_agent_id_fkey(${MEMBER_COLUMNS})`;

export function mapPublicProfile(ctx: ApiContext, row: Row): PublicProfile {
  return {
    id: text(row.id),
    fullName: text(row.full_name, 'Selit member'),
    campusLocation: text(row.school),
    department: text(row.department),
    bio: text(row.bio),
    whatsApp: whatsAppOf(row),
    profileImageUrl: ctx.publicUrl('avatars', text(row.avatar_path)),
    role: role(row.role),
    averageRating: num(row.rating_average),
    reviewCount: num(row.review_count),
    verificationStatus: verification(row.verification_status),
    createdAt: text(row.created_at),
  };
}

export function mapSessionUser(ctx: ApiContext, row: Row, email: string): SessionUser {
  const profile = mapPublicProfile(ctx, row);
  return {
    id: profile.id,
    email,
    fullName: profile.fullName,
    role: profile.role,
    status: accountStatus(row.status),
    campusLocation: profile.campusLocation,
    department: profile.department,
    bio: profile.bio,
    whatsApp: profile.whatsApp,
    profileImageUrl: profile.profileImageUrl,
    verificationStatus: profile.verificationStatus,
    createdAt: profile.createdAt,
  };
}

function mapSeller(ctx: ApiContext, raw: unknown): ListingSeller | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Row;
  const profile = mapPublicProfile(ctx, row);
  return {
    id: profile.id,
    fullName: profile.fullName,
    profileImageUrl: profile.profileImageUrl,
    campusLocation: profile.campusLocation,
    whatsApp: profile.whatsApp,
    role: profile.role,
    status: accountStatus(row.status),
    verificationStatus: profile.verificationStatus,
    averageRating: profile.averageRating,
    reviewCount: profile.reviewCount,
    createdAt: profile.createdAt,
  };
}

const LISTING_STATUSES: ListingStatus[] = ['active', 'sold', 'pending', 'rejected', 'removed'];

export function mapListing(ctx: ApiContext, row: Row): Listing {
  const paths = strings(row.photo_paths);
  return {
    id: text(row.id),
    sellerId: text(row.seller_id),
    title: text(row.title, 'Untitled item'),
    description: text(row.description),
    price: num(row.price),
    category: text(row.category, 'other'),
    condition: text(row.condition, 'good'),
    images: paths.map((path) => ctx.publicUrl('listing-photos', path)),
    imagePaths: paths,
    school: text(row.school),
    location: text(row.meetup_spot),
    status: LISTING_STATUSES.includes(row.status as ListingStatus)
      ? (row.status as ListingStatus)
      : 'pending',
    reviewReason: typeof row.review_reason === 'string' ? row.review_reason : null,
    viewsCount: num(row.views_count),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at, text(row.created_at)),
    seller: mapSeller(ctx, row.seller),
  };
}

const APARTMENT_STATUSES: ApartmentStatus[] = [
  'available',
  'taken',
  'pending',
  'rejected',
  'removed',
];

export function mapApartment(ctx: ApiContext, row: Row): Apartment {
  const agent = (row.agent ?? {}) as Row;
  const paths = strings(row.photo_paths);
  return {
    id: text(row.id),
    title: text(row.title, 'Apartment'),
    description: text(row.description),
    type: text(row.type, 'self-contain') as ApartmentType,
    rentPerYear: num(row.rent_per_year),
    agencyFee: num(row.agency_fee),
    cautionFee: num(row.caution_fee),
    school: text(row.school),
    area: text(row.area),
    distanceToCampus: text(row.distance_to_campus),
    images: paths.map((path) => ctx.publicUrl('apartment-photos', path)),
    imagePaths: paths,
    amenities: strings(row.amenities),
    status: APARTMENT_STATUSES.includes(row.status as ApartmentStatus)
      ? (row.status as ApartmentStatus)
      : 'pending',
    isConfirmed: row.is_confirmed === true,
    visitorConfirmations: num(row.visitor_confirmations),
    lastRenewedAt: text(row.last_renewed_at, text(row.created_at)),
    createdAt: text(row.created_at),
    viewsCount: num(row.views_count),
    agent: {
      id: text(agent.id, text(row.agent_id)),
      fullName: text(agent.full_name, 'Agent'),
      profileImageUrl: ctx.publicUrl('avatars', text(agent.avatar_path)),
      whatsApp: whatsAppOf(agent),
      agencyName: text(row.agency_name),
      isVerified: agent.verification_status === 'verified',
    },
  };
}

export function mapReview(ctx: ApiContext, row: Row, reactedIds: Set<string>): Review {
  const reviewer = row.reviewer as Row | null | undefined;
  return {
    id: text(row.id),
    reviewerId: text(row.reviewer_id),
    sellerId: text(row.seller_id),
    rating: num(row.rating),
    comment: text(row.comment),
    sellerReply: typeof row.seller_reply === 'string' ? row.seller_reply : null,
    sellerReplyUpdatedAt: typeof row.seller_replied_at === 'string' ? row.seller_replied_at : null,
    reactionCount: num(row.helpful_count),
    hasReacted: reactedIds.has(text(row.id)),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
    reviewer: reviewer
      ? {
          id: text(reviewer.id),
          fullName: text(reviewer.full_name, 'Selit member'),
          profileImageUrl: ctx.publicUrl('avatars', text(reviewer.avatar_path)),
        }
      : null,
  };
}
