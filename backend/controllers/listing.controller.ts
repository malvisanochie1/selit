// import { Request, Response } from 'express';
// import { ListingService } from '../services/listing.service.js';
// import { sendSuccess, sendError } from '../utils/apiResponse.js';
// import { validateId, validatePagination } from '../middleware/validate.middleware.js';
// import { validateCreateListing, validateUpdateListing } from '../models/Listing.js';
// import { asyncHandler } from '../middleware/error.middleware.js';
// import { API_MESSAGES, HTTP_STATUS } from '../utils/constants.js';

// export class ListingController {
//   // Get all listings
//   static getListings = asyncHandler(async (req: Request, res: Response) => {
//     const { page, limit } = validatePagination(req.query);
//     const filters = {
//       category: req.query.category as string,
//       location: req.query.location as string,
//       minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
//       maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
//       status: req.query.status as string,
//       userId: req.query.userId as string,
//       search: req.query.search as string,
//     };

//     const result = await ListingService.getListings(filters, page, limit);
//     sendSuccess(res, result);
//   });

//   // Get listing by ID
//   static getListingById = asyncHandler(async (req: Request, res: Response) => {
//     const listingId = validateId(req.params.id);
//     const listing = await ListingService.getListingById(listingId);
    
//     sendSuccess(res, listing);
//   });

//   // Create listing
//   static createListing = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const listingData = validateCreateListing(req.body);
//     const listing = await ListingService.createListing(req.user.id, listingData);
    
//     sendSuccess(res, listing, API_MESSAGES.CREATED, HTTP_STATUS.CREATED);
//   });

//   // Update listing
//   static updateListing = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const listingId = validateId(req.params.id);
//     const updateData = validateUpdateListing(req.body);
//     const listing = await ListingService.updateListing(listingId, req.user.id, updateData);
    
//     sendSuccess(res, listing, API_MESSAGES.UPDATED);
//   });

//   // Delete listing
//   static deleteListing = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const listingId = validateId(req.params.id);
//     await ListingService.deleteListing(listingId, req.user.id);
    
//     sendSuccess(res, null, API_MESSAGES.DELETED);
//   });

//   // Get user's listings
//   static getUserListings = asyncHandler(async (req: Request, res: Response) => {
//     const userId = validateId(req.params.userId);
//     const { page, limit } = validatePagination(req.query);
//     const result = await ListingService.getUserListings(userId, page, limit);
    
//     sendSuccess(res, result);
//   });

//   // Get current user's listings
//   static getCurrentUserListings = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const { page, limit } = validatePagination(req.query);
//     const result = await ListingService.getUserListings(req.user.id, page, limit);
    
//     sendSuccess(res, result);
//   });

//   // Search listings
//   static searchListings = asyncHandler(async (req: Request, res: Response) => {
//     const { q: query, page, limit } = req.query;
    
//     if (!query || typeof query !== 'string') {
//       sendError(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     const { page: pageNum, limit: limitNum } = validatePagination({ page, limit });
//     const result = await ListingService.searchListings(query, pageNum, limitNum);
    
//     sendSuccess(res, result);
//   });

//   // Get listings by category
//   static getListingsByCategory = asyncHandler(async (req: Request, res: Response) => {
//     const { category } = req.params;
//     const { page, limit } = validatePagination(req.query);
    
//     if (!category) {
//       sendError(res, 'Category is required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     const result = await ListingService.getListingsByCategory(category, page, limit);
//     sendSuccess(res, result);
//   });

//   // Get categories
//   static getCategories = asyncHandler(async (req: Request, res: Response) => {
//     const categories = await ListingService.getCategories();
//     sendSuccess(res, categories);
//   });

//   // Update listing status
//   static updateListingStatus = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const listingId = validateId(req.params.id);
//     const { status } = req.body;
    
//     if (!status || typeof status !== 'string') {
//       sendError(res, 'Status is required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     const listing = await ListingService.updateListingStatus(listingId, req.user.id, status);
//     sendSuccess(res, listing, 'Listing status updated successfully');
//   });

//   // Get featured listings (most recent active listings)
//   static getFeaturedListings = asyncHandler(async (req: Request, res: Response) => {
//     const { page, limit } = validatePagination(req.query);
//     const filters = { status: 'active' };
//     const result = await ListingService.getListings(filters, page, limit);
    
//     sendSuccess(res, result);
//   });

//   // Get trending listings (most viewed or popular)
//   static getTrendingListings = asyncHandler(async (req: Request, res: Response) => {
//     const { page, limit } = validatePagination(req.query);
//     const filters = { status: 'active' };
//     const result = await ListingService.getListings(filters, page, limit);
    
//     // For now, return recent listings. You can implement trending logic later
//     sendSuccess(res, result);
//   });
// }
