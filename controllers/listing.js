const Listing = require("../models/listings.js");
const Booking = require("../models/booking.js");

module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let filter = {};
    if (category && category !== 'all') {
        filter.category = category;
    }
    if (search && search.trim() !== "") {
        // Case-insensitive search on title or location
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
        ];
    }
    const allListings = await Listing.find(filter);
    res.render("./listings/index.ejs", { allListings, selectedCategory: category || 'all' });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    if (!req.user || !req.user._id) {
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await listing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate: {path: "author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    } else {
        res.render("./listings/show.ejs", { listing });
    }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you trying to edit does not exists");
        res.redirect("/listings");
    } else {
        let originalImageUrl = (listing.image && listing.image.url) ? listing.image.url : "";
        if (originalImageUrl) {
            originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_300/");
        }
        res.render("./listings/edit.ejs", { listing, originalImageUrl });
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if (typeof req.file !== "undefined") {
        let imageUrl = req.file.path;
        let fileName = req.file.filename;
        listing.image.url = imageUrl;
        listing.image.filename = fileName;
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Booking.deleteMany({ listing: id });
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};