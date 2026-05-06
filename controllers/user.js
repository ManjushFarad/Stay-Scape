const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "Error logging in after registration");
                res.redirect("/login");
                return;
            }
            else {
                req.flash("success", "Welcome to Wanderlust");
                res.redirect("/listings");
            }
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Error logging out");
            res.redirect("/listings");
            return next(err);
        }
        else {
            req.flash("success", "Logged out successfully");
            res.redirect("/listings");
        }
    });
};
