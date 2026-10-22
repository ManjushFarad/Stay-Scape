const Booking = require("../models/booking.js");
const Listing = require("../models/listings.js");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params; // listing id
    const { checkInDate, checkOutDate, totalGuests } = req.body;
    
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner) {
        req.flash("error", "This listing currently has no active host and cannot accept bookings");
        return res.redirect(`/listings/${id}`);
    }

    const hostId = listing.owner._id ? listing.owner._id : listing.owner;
    if (hostId.equals(req.user._id)) {
        req.flash("error", "You cannot book your own listing");
        return res.redirect(`/listings/${id}`);
    }
    
    // Server-side validation
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
        req.flash("error", "Check-in date cannot be in the past");
        return res.redirect(`/listings/${id}`);
    }

    if (checkOut <= checkIn) {
        req.flash("error", "Check-out date must be after check-in date");
        return res.redirect(`/listings/${id}`);
    }

    // Check for duplicate active booking with the exact same details
    const existingBooking = await Booking.findOne({
        listing: id,
        guest: req.user._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalGuests: totalGuests,
        status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingBooking) {
        req.flash("error", "You already have an active booking request for this listing.");
        return res.redirect(`/listings/${id}`);
    }

    const booking = new Booking({
        listing: id,
        guest: req.user._id,
        host: hostId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalGuests
    });

    await booking.save();
    req.flash("success", "Booking request sent to the host!");
    res.redirect("/my-bookings");
};

module.exports.guestBookings = async (req, res) => {
    const bookings = await Booking.find({ guest: req.user._id }).populate("listing");
    res.render("bookings/guest_dashboard.ejs", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/my-bookings");
    }

    if (!booking.guest || !booking.guest.equals(req.user._id)) {
        req.flash("error", "You do not have permission to cancel this booking");
        return res.redirect("/my-bookings");
    }

    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking successfully cancelled!");
    res.redirect("/my-bookings");
};

module.exports.hostBookings = async (req, res) => {
    const bookings = await Booking.find({ host: req.user._id }).populate("listing").populate("guest");
    res.render("bookings/host_dashboard.ejs", { bookings });
};

module.exports.updateStatus = async (req, res) => {
    const { id, status } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/host/bookings");
    }

    if (!booking.host || !booking.host.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect("/host/bookings");
    }

    if (['Accepted', 'Rejected'].includes(status)) {
        booking.status = status;
        await booking.save();
        req.flash("success", `Booking ${status.toLowerCase()} successfully!`);
    }

    res.redirect("/host/bookings");
};
