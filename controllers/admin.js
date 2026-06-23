const User = require("../models/user.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

module.exports.dashboard = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalBookings = await Booking.countDocuments();
    res.render("admin/dashboard.ejs", { totalUsers, totalListings, totalReviews, totalBookings });
};

module.exports.manageUsers = async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } });
    res.render("admin/users.ejs", { users });
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    // 1. Delete all bookings where user is guest or host
    await Booking.deleteMany({ $or: [{ guest: id }, { host: id }] });
    
    // 2. Delete all reviews authored by this user
    await Review.deleteMany({ author: id });
    
    // 3. Find and delete all listings owned by user (triggers review deletion hooks)
    const userListings = await Listing.find({ owner: id });
    for (const listing of userListings) {
        await Listing.findByIdAndDelete(listing._id);
    }
    
    // 4. Finally delete user
    await User.findByIdAndDelete(id);
    
    req.flash("success", "User and all associated data successfully deleted.");
    res.redirect("/admin/users");
};

module.exports.manageListings = async (req, res) => {
    const listings = await Listing.find().populate("owner");
    res.render("admin/listings.ejs", { listings });
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Booking.deleteMany({ listing: id });
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing and its associated data successfully deleted.");
    res.redirect("/admin/listings");
};

module.exports.manageReviews = async (req, res) => {
    const reviews = await Review.find().populate("author");
    res.render("admin/reviews.ejs", { reviews });
};

module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    await Listing.updateMany({ reviews: id }, { $pull: { reviews: id } });
    await Review.findByIdAndDelete(id);
    req.flash("success", "Review successfully deleted.");
    res.redirect("/admin/reviews");
};

module.exports.manageBookings = async (req, res) => {
    const bookings = await Booking.find()
        .populate("listing")
        .populate("guest")
        .populate("host");
    res.render("admin/bookings.ejs", { bookings });
};

module.exports.deleteBooking = async (req, res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking request successfully deleted.");
    res.redirect("/admin/bookings");
};
