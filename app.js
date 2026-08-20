const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const listings = require("./routers/listing.js");
const reviews = require("./routers/review.js");
// const ejsMate = require("ejs-Mate");   // for

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

app.get('/', (req,res) => {
    res.send("Hi i am coder..")
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
