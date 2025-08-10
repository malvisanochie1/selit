import { Router } from 'express';
// import { ListingController } from '../controllers/listing.controller.js';
// import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';
// import { validate } from '../middleware/validate.middleware.js';
// import { validateCreateListing, validateUpdateListing } from '../models/Listing.js';

const router = Router();

// // Public routes
// router.get('/', optionalAuth, ListingController.getListings);
// router.get('/search', optionalAuth, ListingController.searchListings);
// router.get('/categories', ListingController.getCategories);
// router.get('/featured', optionalAuth, ListingController.getFeaturedListings);
// router.get('/trending', optionalAuth, ListingController.getTrendingListings);
// router.get('/category/:category', optionalAuth, ListingController.getListingsByCategory);
// router.get('/:id', optionalAuth, ListingController.getListingById);

// // Protected routes
// router.post('/', authenticateToken, validate(validateCreateListing), ListingController.createListing);
// router.put('/:id', authenticateToken, validate(validateUpdateListing), ListingController.updateListing);
// router.delete('/:id', authenticateToken, ListingController.deleteListing);
// router.put('/:id/status', authenticateToken, ListingController.updateListingStatus);

// // User-specific routes
// router.get('/user/:userId', optionalAuth, ListingController.getUserListings);
// router.get('/me/listings', authenticateToken, ListingController.getCurrentUserListings);

export default router;
