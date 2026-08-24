const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

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
        req.flash("success", "Welcome to MandalGo!");
        res.redirect("/listings");
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
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {

        req.flash("success", "Welcome back to MandalGo!");

        res.redirect("/listings");
    }
);

module.exports = router;