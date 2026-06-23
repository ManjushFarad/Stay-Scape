const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));
router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.guestBookings));
router.delete("/my-bookings/:id", isLoggedIn, wrapAsync(bookingController.cancelBooking));
router.get("/host/bookings", isLoggedIn, wrapAsync(bookingController.hostBookings));
router.post("/host/bookings/:id/:status", isLoggedIn, wrapAsync(bookingController.updateStatus));

module.exports = router;
