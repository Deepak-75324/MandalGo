// ================================
// DNS CONFIGURATION
// ================================

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);


// ================================
// ENVIRONMENT VARIABLES
// ================================

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


// ================================
// IMPORTS
// ================================

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");


// ================================
// APP CONFIGURATION
// ================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ================================
// MIDDLEWARE
// ================================

app.use(express.urlencoded({ extended: true }));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(methodOverride("_method"));


// ================================
// DATABASE CONFIGURATION
// ================================

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
    console.error("❌ ATLASDB_URL is not defined!");
    process.exit(1);
}


// ================================
// DATABASE CONNECTION
// ================================

async function main() {

    try {

        await mongoose.connect(dbUrl);

        console.log("✅ Connected to MongoDB Atlas");

    } catch (err) {

        console.error(
            "❌ Database connection error:",
            err.message
        );

        process.exit(1);
    }
}

main();


// ================================
// SESSION STORE
// ================================

const store = MongoStore.create({

    mongoUrl: dbUrl,

    crypto: {
        secret: process.env.SECRET
    },

    touchAfter: 24 * 3600

});


// SESSION STORE ERROR

store.on("error", (err) => {

    console.log(
        "❌ ERROR IN MONGO SESSION STORE:",
        err
    );

});


// ================================
// SESSION CONFIGURATION
// ================================

const sessionOptions = {

    store: store,

    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {

        expires:
            Date.now() +
            7 * 24 * 60 * 60 * 1000,

        maxAge:
            7 * 24 * 60 * 60 * 1000,

        httpOnly: true

    }

};


// ================================
// SESSION
// ================================

app.use(
    session(sessionOptions)
);


// ================================
// FLASH
// ================================

app.use(flash());


// ================================
// PASSPORT
// ================================

app.use(passport.initialize());

app.use(passport.session());


// ================================
// PASSPORT LOCAL STRATEGY
// ================================

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);


// ================================
// PASSPORT SERIALIZATION
// ================================

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// ================================
// GLOBAL VARIABLES
// ================================

app.use((req, res, next) => {

    res.locals.success =
        req.flash("success");

    res.locals.error =
        req.flash("error");

    res.locals.currentUser =
        req.user;

    next();

});


// ================================
// HOME ROUTE
// ================================

app.get("/", (req, res) => {

    res.redirect("/listings");

});


// ================================
// LISTING ROUTES
// ================================

app.use(
    "/listings",
    listingRouter
);


// ================================
// REVIEW ROUTES
// ================================

app.use(
    "/listings/:id/reviews",
    reviewRouter
);


// ================================
// USER / AUTH ROUTES
// ================================

app.use(
    "/",
    userRouter
);


// ================================
// 404 ROUTE
// ================================

app.all("/{*splat}", (req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page not found!"
        )
    );

});


// ================================
// ERROR HANDLER
// ================================

app.use(
    (err, req, res, next) => {

        console.error(
            "❌ ERROR:",
            err
        );

        const statusCode =
            err.statusCode || 500;

        const message =
            err.message ||
            "Something went wrong!";

        res.status(statusCode).render(
            "error.ejs",
            {
                message,
                statusCode
            }
        );

    }
);


// ================================
// START SERVER
// ================================

// Render provides PORT.
// Localhost uses 8080 if PORT is not available.

const PORT =
    process.env.PORT || 8080;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🚀 MandalGo server running on port ${PORT}`
        );

    }
);