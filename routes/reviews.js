const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review.js');
const Listing = require('../models/listings.js');
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { reviewSchema } = require("../schema.js");
const reviewController = require("../controllers/review.js");

// Add Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
