const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");

router.use(isLoggedIn, isAdmin);

router.get("/", wrapAsync(adminController.dashboard));

router.get("/users", wrapAsync(adminController.manageUsers));
router.delete("/users/:id", wrapAsync(adminController.deleteUser));

router.get("/listings", wrapAsync(adminController.manageListings));
router.delete("/listings/:id", wrapAsync(adminController.deleteListing));

router.get("/reviews", wrapAsync(adminController.manageReviews));
router.delete("/reviews/:id", wrapAsync(adminController.deleteReview));

router.get("/bookings", wrapAsync(adminController.manageBookings));
router.delete("/bookings/:id", wrapAsync(adminController.deleteBooking));

module.exports = router;
