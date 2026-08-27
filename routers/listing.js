const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");;

// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, newListingForm, newListingPost, showListing, editListing, updateListing, deleteListing } = require("../controllers/listings.js");
// const { findById } = require("../models/review.js");


router.route("/")
.get( wrapAsync(index))   // INDEX ROUTE
.post(                     // CREATE ROUTE
    isLoggedIn,
    validateListing,
    newListingPost
);

// NEW ROUTE
// GET /listings/new
router.get("/new", isLoggedIn, newListingForm);


router.route("/:id")
.get(                     // SHOW ROUTE
    wrapAsync(showListing))
.put(                        // UPDATE ROUTE
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(updateListing)
)
.delete(                 // DELETE ROUTE
    isLoggedIn,
    isOwner,
    wrapAsync(deleteListing) 
);


// EDIT ROUTE
// GET /listings/:id/edit
router.get(
    "/:id/edit",
    isLoggedIn,
    wrapAsync(editListing)
);

module.exports = router;