const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapasync');
const passport = require('passport');
const { isLoggedIn, saveRedirectURL } = require('../middleware.js');
const userController = require('../controllers/user.js');

// SIGNUP
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// LOGIN
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectURL, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);

// LOGOUT
router.get("/logout", userController.logout);



// // SIGNUP
// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", wrapAsync(userController.signup));

// // LOGIN
// router.get("/login", userController.renderLoginForm);
// router.post("/login", saveRedirectURL, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);

// // LOGOUT
// router.get("/logout", userController.logout);

module.exports = router;