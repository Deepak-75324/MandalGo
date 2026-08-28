if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");

// APP CONFIGURATION

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// DATABASE CONNECTION
main()
    .then(() => {
        console.log("connect to DB");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

async function main() {
    await mongoose.connect(
        "mongodb://127.0.0.1:27017/wonderlust"
    );
}
// SESSION CONFIGURATION

const sessionOptions = {
    secret: "mysupersecretcode",

    resave: false,

    saveUninitialized: false,

    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,

        httpOnly: true
    }
};

// SESSION + FLASH
app.use(session(sessionOptions));

app.use(flash());

// PASSPORT CONFIGURATION

// Initialize Passport
app.use(passport.initialize());

// Enable persistent login sessions
app.use(passport.session());


// Local username/password authentication
passport.use(
    new LocalStrategy(User.authenticate())
);


// Store logged-in user's ID in session
passport.serializeUser(
    User.serializeUser()
);


// Retrieve user from session
passport.deserializeUser(
    User.deserializeUser()
);

// FLASH MESSAGE MIDDLEWARE
app.use((req, res, next) => {

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    // Make logged-in user available in EJS
    res.locals.currentUser = req.user;

    next();
});

// HOME ROUTE

app.get("/", (req, res) => {

    res.send("Hi I am coder..");

});

// LISTING ROUTES
app.use(
    "/listings",
    listingRouter
);
// REVIEW ROUTES
app.use(
    "/listings/:id/reviews",
    reviewRouter
);
// USER / AUTHENTICATION ROUTES
app.use(
    "/",
    userRouter
);
// 404 ROUTE
app.all("/{*splat}", (req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page not found!"
        )
    );

});

// CUSTOM ERROR HANDLER
app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went wrong!"
    } = err;

    res.status(statusCode).render(
        "error.ejs",
        {
            message,
            statusCode
        }
    );

});
// START SERVER

app.listen(
    8080,
    "0.0.0.0",
    () => {

        console.log(
            "app is listening on port 8080"
        );

    }
);