const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const path = require('path');
const methodOverride = require('method-override');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema");
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

// index route
// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render('listing/index.ejs', { allListings, title: "Explore Listings | MandalGo" });
// });
app.get("/listings", wrapAsync(async (req, res) => {

    const count = await Listing.countDocuments();

    const allListings = await Listing.aggregate([  // it helps to show listing in random sequence
        { $sample: { size: count } }
    ]);

    res.render("listing/index.ejs", { allListings, title: "Explore Listings | MandalGo"});
}));

//new and create route
app.get("/listings/new", (req,res) => {
    res.render("listing/new.ejs", { title: "Add Listing | MandalGo" });
});

// listingSchema validation function
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, ereMsg);
    }else{
        next();
    }
};
const validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {
        console.log("joi error details:", error.details);

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//create route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/listings");
}));

// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    // if(!req.body.listing){  // custom error handling
    //     throw new ExpressError(400, "send valid data for listing!");
    // }
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", {listing, title: "Edit Listing | MandalGo"});
}));
// update route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {

    const { id } = req.params;

    const listingData = req.body.listing;

    // Determine the submitted image value.
    // The form submits image as an object: listing[image][url] (+ filename).
    const submittedImage = listingData.image;
    const submittedUrl =
        submittedImage && typeof submittedImage === "object"
            ? submittedImage.url
            : submittedImage;

    // If the user did not provide a new image (empty or missing),
    // keep the previously saved image.
    if (!submittedUrl || submittedUrl.trim() === "") {
        const existing = await Listing.findById(id);
        if (existing) {
            listingData.image = existing.image;
        }
    }

    await Listing.findByIdAndUpdate(
        id,
        listingData,
        {
            new: true,
            runValidators: true
        }
    );

    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// post request
// review route

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New review saved");

    res.redirect(`/listings/${listing._id}`);
}));

// delete review route
app.delete(
    "/listings/:id/reviews/:reviewId",
    wrapAsync(async (req, res) => {

        const { id, reviewId } = req.params;

        // Remove review ID from Listing
        await Listing.findByIdAndUpdate(
            id,
            {
                $pull: {
                    reviews: reviewId
                }
            }
        );

        // Delete actual Review document
        await Review.findByIdAndDelete(reviewId);

        console.log("Review deleted");

        res.redirect(`/listings/${id}`);
    })
);

// show route
app.get("/listings/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listing/show.ejs", { listing, title: "Listing Details | MandalGo" });
}));


// // all listening route
// app.get('/testListing', async(req,res) => {
//     let sampleListing = new Listing({
//         title: "Janaki temple",
//         description: "Birth place of raja Janak and lord mata Sita",
//         price: 10,
//         location: "Janakpur",
//         country: "Nepal",
//         category: "Tourist place",
//         rating: 4.5,
//     });

//     await sampleListing.save()
//     .then(res => {console.log("Data was saved!");
//     })
//     .catch(err => console.log(err));
//     res.send("All Listing..");
// });

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
