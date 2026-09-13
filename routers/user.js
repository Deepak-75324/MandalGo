const express = require('express');
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const { singup, singupPost, singupForm, loginForm, loginPost, logout, aboutpage } = require('../controllers/user.js');

router.route("/signup")
    .get(singupForm)    // signup pform  render
    .post(wrapAsync(singupPost));   // signup post request

router.route("/login")
    .get(loginForm)  // login form render
    .post(            // login post request
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }
    ),
    loginPost
);

router.post("/logout", logout);
router.get("/about", aboutpage);

module.exports = router;