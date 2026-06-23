const User = require("../models/user.js");
const Listing = require("../models/listings.js");

module.exports.index = async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.render("wishlist/index.ejs", { allListings: user.wishlist });
};

module.exports.toggleWishlist = async (req, res) => {
    let { id } = req.params;
    const user = await User.findById(req.user._id);
    
    const index = user.wishlist.indexOf(id);
    let added = false;
    
    if (index === -1) {
        user.wishlist.push(id);
        added = true;
    } else {
        user.wishlist.splice(index, 1);
    }
    
    await user.save();
    
    res.json({ success: true, added });
};
