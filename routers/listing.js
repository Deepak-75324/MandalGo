const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");;

const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const { findById } = require("../models/review.js");
// ===============================
// INDEX ROUTE
// GET /listings
// ===============================

router.get("/", wrapAsync(async (req, res) => {

    const count = await Listing.countDocuments();

    const allListings = await Listing.aggregate([
        { $sample: { size: count } }
    ]);

    res.render("listing/index.ejs", {
        allListings,
        title: "Explore Listings | MandalGo"
    });

}));


// ===============================
// NEW ROUTE
// GET /listings/new
// IMPORTANT: Must be BEFORE /:id
// ===============================

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listing/new.ejs", {
        title: "Add Listing | MandalGo"
    });

});


// ===============================
// CREATE ROUTE
// POST /listings
// ===============================

router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing added!");
        res.redirect("/listings");

    })
);


// ===============================
// SHOW ROUTE
// GET /listings/:id
// ===============================
router.get(
    "/:id",
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id)
            .populate("owner")
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            });

        if (!listing) {
            req.flash(
                "error",
                "Listing you requested for does not exist"
            );

            return res.redirect("/listings");
        }

        res.render("listing/show.ejs", {
            listing,
            title: `${listing.title} | MandalGo`
        });
    })
);
// ===============================
// EDIT ROUTE
// GET /listings/:id/edit
// ===============================

router.get(
    "/:id/edit",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing you request for does not exist");
            return res.redirect("/listings");
        }

        res.render("listing/edit.ejs", {
            listing,
            title: "Edit Listing | MandalGo"
        });

    })
);


// ===============================
// UPDATE ROUTE
// PUT /listings/:id
// ===============================

router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {

        const { id } = req.params;
        const listingData = req.body.listing;
        // Find listing
        const listing = await Listing.findById(id);
        // Update listing
        await Listing.findByIdAndUpdate(
            id,
            listingData,
            {
                new: true,
                runValidators: true
            }
        );

        req.flash("success", "Listing was updated!");

        res.redirect(`/listings/${id}`);
    })
);
// ===============================
// DELETE ROUTE
// DELETE /listings/:id
// ===============================

router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        // Delete listing
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
    })
);

module.exports = router;