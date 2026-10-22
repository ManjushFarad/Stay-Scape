const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be signed in to access this page");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectURL = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next()
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params; 
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are trying to access does not exist");
        return res.redirect("/listings");
    }
    if (res.locals.currentUser && res.locals.currentUser.role === 'admin') {
        return next();
    }
    const ownerId = listing.owner && listing.owner._id ? listing.owner._id : listing.owner;
    if (!ownerId || !res.locals.currentUser || !ownerId.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission as you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    } 
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Joi validation middleware (Review)
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review does not exist");
        return res.redirect(`/listings/${id}`);
    }
    if (res.locals.currentUser && res.locals.currentUser.role === 'admin') {
        return next();
    }
    const authorId = review.author && review.author._id ? review.author._id : review.author;
    if (!authorId || !res.locals.currentUser || !authorId.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission as you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    } 
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        req.flash("error", "Access Denied. You must be an admin to do that.");
        res.redirect("/listings");
    }
}