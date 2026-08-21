const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const flash = require("connect-flash");


const listings = require("./routers/listing.js");
const reviews = require("./routers/review.js");
// const ejsMate = require("ejs-Mate");   // for
const session = require("express-session");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// app.engine("ejs", ejsMate);
// connect to mongo db
main()
.then((res) => {
    console.log("connect to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
app.use(flash());
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: true,
    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));

app.get('/', (req,res) => {
    res.send("Hi i am coder..")
});
//flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


// if not match in any route then
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Custom error handling
app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went wrong!"
    } = err;

    res.status(statusCode).render("error.ejs", {
        message,
        statusCode
    });

});
app.listen(8080,"0.0.0.0", () => {
    console.log("app is listening on port 8080");
});
