const User = require("../models/user.js");

module.exports.singupForm = (req,res) => {
    res.render("users/signup.ejs", {
        title: "Sign Up | MandalGo"

    });

};
module.exports.singupPost = async (req, res) => {
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
};
module.exports.loginForm = (req,res) => {
    res.render("users/login.ejs", {
        title: "Login | MandalGo"
    });

};

module.exports.loginPost = (req, res) => {

    req.flash("success", "Welcome back to MandalGo!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    // delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};