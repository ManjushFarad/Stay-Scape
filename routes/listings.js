const express = require('express');
const router = express.Router();
const Listing = require('../models/listings');
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
// Index Route
.get(wrapAsync(listingController.index))
// Create Route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


// New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);


router.route("/:id")
// Show Route
.get(wrapAsync(listingController.showListing))
// Update Route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
// Delete Route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




// // Index Route
// router.get("/", wrapAsync(listingController.index));

// // New Route
// router.get('/new', isLoggedIn, listingController.renderNewForm);

// // Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// // Show Route
// router.get('/:id', wrapAsync(listingController.showListing));

// // Edit Route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// // Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// // Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
