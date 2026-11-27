// Sample mode: the whole app runs on realistic local data until Supabase keys
// are added. Every function mirrors its live twin, including loading delays.

import { ApiError } from '../errors';
import { SAMPLE_ADMIN_USERS, SAMPLE_REPORTS, SAMPLE_VERIFICATIONS } from '../sample/admin';
import { SAMPLE_APARTMENTS } from '../sample/apartments';
import { SAMPLE_LISTINGS } from '../sample/listings';
import { SAMPLE_SELLERS, SAMPLE_USERS, sampleUserForEmail } from '../sample/people';
import { SAMPLE_REVIEWS } from '../sample/reviews';
import { CATEGORIES } from '../catalog/categories';
import type {
  AdminStats,
  Apartment,
  ApartmentFilters,
  CategoryStat,
  Listing,
  ListingFilters,
  PhotoUpload,
  Review,
  SellerReviews,
  SessionUser,
  VerificationRecord,
} from '../types';
import { paginate, sampleDelay } from '../utils/pagination';
import type { SelitApi } from './index';

/** Somewhere to remember who is signed in between launches (localStorage, AsyncStorage). */
export type SessionStore = {
  get(key: string): Promise<string | null> | string | null;
  set(key: string, value: string | null): Promise<void> | void;
};

const SESSION_KEY = 'selit.sample-session';

function previews(photos: PhotoUpload[] = []) {
  return photos.map((photo) => photo.previewUrl ?? '').filter(Boolean);
}

export function createSampleApi(store?: SessionStore): SelitApi {
  let listings: Listing[] = [...SAMPLE_LISTINGS];
  let apartments: Apartment[] = [...SAMPLE_APARTMENTS];
  let reviews: Review[] = [...SAMPLE_REVIEWS];
  let users = [...SAMPLE_ADMIN_USERS];
  let reports = [...SAMPLE_REPORTS];
  let verifications = [...SAMPLE_VERIFICATIONS];
  const pausedCategories = new Set<string>();
  let verification: VerificationRecord = {
    status: SAMPLE_USERS[0].verificationStatus,
    submittedAt: null,
    reviewNote: null,
  };
  let current: SessionUser | null = null;
  let restored = false;

  async function session() {
    if (!restored && store) {
      restored = true;
      const id = await store.get(SESSION_KEY);
      current = SAMPLE_USERS.find((user) => user.id === id) ?? null;
    }
    return current;
  }

  async function setSession(user: SessionUser | null) {
    current = user;
    restored = true;
    await store?.set(SESSION_KEY, user?.id ?? null);
  }

  async function requireUser() {
    const user = await session();
    if (!user) throw new ApiError('Please sign in to continue.', 401, 'sign_in_required');
    return user;
  }

  function findListing(id: string) {
    const listing = listings.find((candidate) => candidate.id === id);
    if (!listing) throw new ApiError("We couldn't find this listing.", 404, 'not_found');
    return listing;
  }

  function findApartment(id: string) {
    const apartment = apartments.find((candidate) => candidate.id === id);
    if (!apartment) throw new ApiError("We couldn't find this apartment.", 404, 'not_found');
    return apartment;
  }

  function listingMatches(listing: Listing, filters: ListingFilters) {
    const status = filters.status ?? 'active';
    if (status !== 'all' && listing.status !== status) return false;
    if (filters.category && listing.category !== filters.category) return false;
    if (filters.school && listing.school !== filters.school) return false;
    if (filters.condition && listing.condition !== filters.condition) return false;
    if (filters.sellerId && listing.sellerId !== filters.sellerId) return false;
    if (filters.priceMin !== undefined && listing.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && listing.price > filters.priceMax) return false;
    if (filters.search) {
      const query = filters.search.toLowerCase();
      if (!`${listing.title} ${listing.description}`.toLowerCase().includes(query)) return false;
    }
    return true;
  }

  function apartmentMatches(apartment: Apartment, filters: ApartmentFilters) {
    const query = filters.search?.toLowerCase();
    return (
      (filters.includeAll || apartment.status === 'available' || apartment.status === 'taken') &&
      (!filters.school || apartment.school === filters.school) &&
      (!filters.type || apartment.type === filters.type) &&
      (!filters.priceMax || apartment.rentPerYear <= filters.priceMax) &&
      (!filters.agentId || apartment.agent.id === filters.agentId) &&
      (!query ||
        `${apartment.title} ${apartment.area} ${apartment.description}`
          .toLowerCase()
          .includes(query))
    );
  }

  function summarise(items: Review[]): SellerReviews {
    const total = items.reduce((sum, item) => sum + item.rating, 0);
    return {
      averageRating: items.length ? Number((total / items.length).toFixed(2)) : 0,
      reviewCount: items.length,
      reviews: items,
    };
  }

  const listingsApi: SelitApi['listings'] = {
    async get(id) {
      await sampleDelay(260);
      return findListing(id);
    },
    async list(filters = {}) {
      await sampleDelay();
      const sort = filters.sort ?? 'newest';
      const items = listings
        .filter((listing) => listingMatches(listing, filters))
        .sort((a, b) => {
          if (sort === 'price_asc') return a.price - b.price;
          if (sort === 'price_desc') return b.price - a.price;
          const difference = Date.parse(b.createdAt) - Date.parse(a.createdAt);
          return sort === 'oldest' ? -difference : difference;
        });
      return paginate(items, filters.page, filters.limit ?? 12);
    },
    async create(input) {
      await sampleDelay(900);
      const seller = await requireUser();
      const now = new Date().toISOString();
      const listing: Listing = {
        id: `lst-${Date.now()}`,
        sellerId: seller.id,
        title: input.title,
        description: input.description,
        price: input.price,
        category: input.category,
        condition: input.condition,
        images: [...input.existingImagePaths, ...previews(input.newPhotos)],
        imagePaths: [],
        school: input.school,
        location: input.location,
        status: 'active',
        reviewReason: null,
        viewsCount: 0,
        createdAt: now,
        updatedAt: now,
        seller: {
          id: seller.id,
          fullName: seller.fullName,
          profileImageUrl: seller.profileImageUrl,
          campusLocation: seller.campusLocation,
          whatsApp: seller.whatsApp,
          role: 'seller',
          status: 'active',
          verificationStatus: seller.verificationStatus,
          averageRating: 4.8,
          reviewCount: 12,
          createdAt: seller.createdAt,
        },
      };
      listings = [listing, ...listings];
      return listing;
    },
    async update(id, update) {
      await sampleDelay(700);
      const currentListing = findListing(id);
      const {
        existingImagePaths,
        newPhotos,
        checkId: _check,
        checkPhoto: _photo,
        ...fields
      } = update;
      const images =
        existingImagePaths || newPhotos?.length
          ? [...(existingImagePaths ?? currentListing.images), ...previews(newPhotos)]
          : currentListing.images;
      const next: Listing = {
        ...currentListing,
        ...fields,
        images,
        updatedAt: new Date().toISOString(),
      };
      listings = listings.map((listing) => (listing.id === id ? next : listing));
      return next;
    },
    async remove(id) {
      await sampleDelay(500);
      listings = listings.filter((listing) => listing.id !== id);
    },
    async recordView(id) {
      listings = listings.map((listing) =>
        listing.id === id ? { ...listing, viewsCount: listing.viewsCount + 1 } : listing,
      );
    },
    async requestCheckCode() {
      await sampleDelay(400);
      const code = Array.from(
        { length: 6 },
        () => 'ACDEFHJKMNPRTUVWXY34679'[Math.floor(Math.random() * 23)],
      ).join('');
      return {
        id: `chk-${Date.now()}`,
        code: `SL-${code}`,
        expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
      };
    },
  };

  const apartmentsApi: SelitApi['apartments'] = {
    async get(id) {
      await sampleDelay(260);
      return findApartment(id);
    },
    async list(filters = {}) {
      await sampleDelay();
      const items = apartments
        .filter((apartment) => apartmentMatches(apartment, filters))
        .sort((a, b) => {
          if (a.status !== b.status) return a.status === 'available' ? -1 : 1;
          if (filters.sort === 'price_asc') return a.rentPerYear - b.rentPerYear;
          if (filters.sort === 'price_desc') return b.rentPerYear - a.rentPerYear;
          return Date.parse(b.lastRenewedAt) - Date.parse(a.lastRenewedAt);
        });
      return paginate(items, filters.page, filters.limit ?? 9);
    },
    async create(input) {
      await sampleDelay(900);
      const agent = await requireUser();
      const now = new Date().toISOString();
      const { photos, ...fields } = input;
      const apartment: Apartment = {
        ...fields,
        id: `apt-${Date.now()}`,
        images: previews(photos),
        imagePaths: [],
        status: 'pending',
        isConfirmed: false,
        visitorConfirmations: 0,
        lastRenewedAt: now,
        createdAt: now,
        viewsCount: 0,
        agent: {
          id: agent.id,
          fullName: agent.fullName,
          profileImageUrl: agent.profileImageUrl,
          whatsApp: agent.whatsApp,
          agencyName: input.agencyName,
          isVerified: agent.verificationStatus === 'verified',
        },
      };
      apartments = [apartment, ...apartments];
      return apartment;
    },
    async remove(id) {
      await sampleDelay(500);
      apartments = apartments.filter((apartment) => apartment.id !== id);
    },
    async sendAction(id, action) {
      await sampleDelay(500);
      apartments = apartments.map((apartment) => {
        if (apartment.id !== id) return apartment;
        if (action === 'renew')
          return { ...apartment, lastRenewedAt: new Date().toISOString(), status: 'available' };
        if (action === 'mark-taken') return { ...apartment, status: 'taken' };
        if (action === 'mark-available') return { ...apartment, status: 'available' };
        if (action === 'confirm-real')
          return { ...apartment, visitorConfirmations: apartment.visitorConfirmations + 1 };
        return apartment;
      });
      return findApartment(id);
    },
    async recordView(id) {
      apartments = apartments.map((apartment) =>
        apartment.id === id ? { ...apartment, viewsCount: apartment.viewsCount + 1 } : apartment,
      );
    },
  };

  const reviewsApi: SelitApi['reviews'] = {
    async forSeller(sellerId) {
      await sampleDelay(300);
      return summarise(reviews.filter((item) => item.sellerId === sellerId));
    },
    async create(sellerId, input) {
      await sampleDelay(600);
      const me = await requireUser();
      if (sellerId === me.id) throw new ApiError("You can't review yourself.", 400, 'forbidden');
      const now = new Date().toISOString();
      const created: Review = {
        id: `rev-${Date.now()}`,
        reviewerId: me.id,
        sellerId,
        ...input,
        sellerReply: null,
        sellerReplyUpdatedAt: null,
        reactionCount: 0,
        hasReacted: false,
        createdAt: now,
        updatedAt: now,
        reviewer: { id: me.id, fullName: me.fullName, profileImageUrl: me.profileImageUrl },
      };
      reviews = [created, ...reviews];
      return created;
    },
    async reply(reviewId, reply) {
      await sampleDelay(500);
      reviews = reviews.map((item) =>
        item.id === reviewId
          ? { ...item, sellerReply: reply || null, sellerReplyUpdatedAt: new Date().toISOString() }
          : item,
      );
      return reviews.find((item) => item.id === reviewId) as Review;
    },
    async toggleHelpful(reviewId) {
      await sampleDelay(250);
      await requireUser();
      const existing = reviews.find((item) => item.id === reviewId);
      const reacted = !existing?.hasReacted;
      const reactionCount = (existing?.reactionCount ?? 0) + (reacted ? 1 : -1);
      reviews = reviews.map((item) =>
        item.id === reviewId ? { ...item, hasReacted: reacted, reactionCount } : item,
      );
      return { reacted, reactionCount };
    },
    async remove(reviewId) {
      await sampleDelay(400);
      reviews = reviews.filter((item) => item.id !== reviewId);
    },
  };

  const findSeller = (id: string) => SAMPLE_SELLERS.find((seller) => seller.id === id) ?? null;

  return {
    isSample: true,

    auth: {
      async getSessionUser() {
        return session();
      },
      async signIn(input) {
        await sampleDelay(600);
        const user = sampleUserForEmail(input.email);
        await setSession(user);
        return user;
      },
      async signUp(input) {
        await sampleDelay(800);
        const user: SessionUser = {
          ...SAMPLE_USERS[0],
          fullName: input.fullName,
          email: input.email,
          role: input.accountType,
        };
        await setSession(SAMPLE_USERS[0]);
        return { user, needsEmailConfirmation: false };
      },
      async signOut() {
        await setSession(null);
      },
      async requestPasswordReset() {
        await sampleDelay(600);
      },
      async updatePassword() {
        await sampleDelay(600);
      },
      async resendConfirmation() {
        await sampleDelay(400);
      },
    },

    profiles: {
      async me() {
        return requireUser();
      },
      async getPublicProfile(id) {
        await sampleDelay(250);
        const seller = findSeller(id);
        if (!seller) throw new ApiError("We couldn't find this member.", 404, 'not_found');
        const { averageRating, reviewCount } = summarise(
          reviews.filter((item) => item.sellerId === id),
        );
        return { ...seller, averageRating, reviewCount };
      },
      async updateMyProfile(input) {
        await sampleDelay(700);
        const user = await requireUser();
        const { image, ...fields } = input;
        const next: SessionUser = {
          ...user,
          ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)),
          profileImageUrl: image?.previewUrl ?? user.profileImageUrl,
        };
        current = next;
        return next;
      },
      async becomeSeller() {
        await sampleDelay(300);
        const user = await requireUser();
        current = { ...user, role: user.role === 'admin' ? 'admin' : 'seller' };
        return current;
      },
    },

    listings: listingsApi,
    apartments: apartmentsApi,
    reviews: reviewsApi,

    reports: {
      async submit() {
        await sampleDelay(700);
        await requireUser();
        return { id: `rep-${Date.now()}` };
      },
    },

    verification: {
      async mine() {
        await sampleDelay(250);
        await requireUser();
        return verification;
      },
      async submit() {
        await sampleDelay(1400);
        verification = {
          status: 'pending',
          submittedAt: new Date().toISOString(),
          reviewNote: null,
        };
        return verification;
      },
    },

    admin: {
      async stats(): Promise<AdminStats> {
        await sampleDelay();
        return {
          members: users.length,
          sellers: users.filter((user) => user.role === 'seller').length,
          verified: SAMPLE_SELLERS.filter((seller) => seller.verificationStatus === 'verified')
            .length,
          banned: users.filter((user) => user.status === 'banned').length,
          activeListings: listings.filter((listing) => listing.status === 'active').length,
          soldListings: listings.filter((listing) => listing.status === 'sold').length,
          pendingListings: listings.filter((listing) => listing.status === 'pending').length,
          availableApartments: apartments.filter((apartment) => apartment.status === 'available')
            .length,
          pendingApartments: apartments.filter((apartment) => apartment.status === 'pending')
            .length,
          pendingVerifications: verifications.filter((request) => request.status === 'pending')
            .length,
          openReports: reports.filter((report) => report.status === 'open').length,
          newMembersThisWeek: 3,
        };
      },
      async listings(status, page) {
        await sampleDelay();
        return paginate(
          listings.filter((listing) => status === 'all' || listing.status === status),
          page,
          20,
        );
      },
      async setListingStatus(id, status) {
        await sampleDelay(400);
        listings = listings.map((listing) =>
          listing.id === id ? { ...listing, status } : listing,
        );
      },
      async apartments(status, page) {
        await sampleDelay();
        return paginate(
          apartments.filter((apartment) => status === 'all' || apartment.status === status),
          page,
          20,
        );
      },
      async setApartmentStatus(id, status, confirmed) {
        await sampleDelay(400);
        apartments = apartments.map((apartment) =>
          apartment.id === id
            ? { ...apartment, status, isConfirmed: confirmed ?? apartment.isConfirmed }
            : apartment,
        );
      },
      async users(filters) {
        await sampleDelay();
        const search = filters.search?.toLowerCase();
        return paginate(
          users.filter(
            (user) =>
              (!filters.role || user.role === filters.role) &&
              (!filters.status || user.status === filters.status) &&
              (!search || `${user.fullName} ${user.email}`.toLowerCase().includes(search)),
          ),
          filters.page,
          20,
        );
      },
      async setUserStatus(id, status) {
        await sampleDelay(400);
        users = users.map((user) => (user.id === id ? { ...user, status } : user));
      },
      async categoryStats(): Promise<CategoryStat[]> {
        await sampleDelay();
        return CATEGORIES.map((category) => {
          const inCategory = listings.filter((listing) => listing.category === category.slug);
          return {
            slug: category.slug,
            name: category.name,
            total: inCategory.length,
            active: inCategory.filter((listing) => listing.status === 'active').length,
            pending: inCategory.filter((listing) => listing.status === 'pending').length,
            status: pausedCategories.has(category.slug) ? 'paused' : 'active',
          };
        });
      },
      async setCategoryStatus(slug, status) {
        await sampleDelay(400);
        if (status === 'paused') pausedCategories.add(slug);
        else pausedCategories.delete(slug);
      },
      async reports(filters) {
        await sampleDelay();
        return paginate(
          reports.filter(
            (report) =>
              report.targetType === filters.target &&
              (!filters.status || report.status === filters.status),
          ),
          filters.page,
          20,
        );
      },
      async setReportStatus(report, status) {
        await sampleDelay(400);
        reports = reports.map((item) => (item.id === report.id ? { ...item, status } : item));
      },
      async verifications(page) {
        await sampleDelay();
        return paginate(
          verifications.filter((request) => request.status === 'pending'),
          page,
          20,
        );
      },
      async decideVerification(id, decision) {
        await sampleDelay(500);
        verifications = verifications.map((request) =>
          request.id === id ? { ...request, status: decision } : request,
        );
      },
    },
  };
}
