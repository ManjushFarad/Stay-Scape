const Listing = require("../models/listings.js");

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
    let imageUrl = req.file.path;
    let fileName = req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image.url = imageUrl;
    listing.image.filename = fileName;
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
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_300/");
        // console.log(originalImageUrl);
        res.render("./listings/edit.ejs", { listing, originalImageUrl });
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, req.body.listing);
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
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};