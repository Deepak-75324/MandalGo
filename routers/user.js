const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req,res) => {
    res.render("users/signup.ejs", {
        title: "Sign Up | MandalGo"

    });

});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            username: username,
            email: email
        });
        const registeredUser = await User.register(
            newUser,
            password
        );
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to MandalGo!");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));
router.get('/login', (req,res) => {
    res.render("users/login.ejs", {
        title: "Login | MandalGo"
    });

});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {

        req.flash("success", "Welcome back to MandalGo!");

        const redirectUrl = res.locals.redirectUrl || "/listings";

        // delete req.session.redirectUrl;

        res.redirect(redirectUrl);
    }
);
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;