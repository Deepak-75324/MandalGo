const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuther } = require("../middleware.js");
const { validateReview} = require("../middleware.js");
// ===============================
// CREATE REVIEW
// POST /listings/:id/reviews
// ===============================

router.post(
    "/",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const review = new Review(req.body.review);

        // Store logged-in user as review author
        review.author = req.user._id;

        listing.reviews.push(review);

        await review.save();
        await listing.save();

        req.flash("success", "Review added!");

        res.redirect(`/listings/${listing._id}`);
    })
);

// ===============================
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// ===============================

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuther,
    wrapAsync(async (req, res) => {

        const { id, reviewId } = req.params;

        // Remove review from Listing
        await Listing.findByIdAndUpdate(
            id,
            {
                $pull: {
                    reviews: reviewId
                }
            }
        );

        // Delete Review document
        await Review.findByIdAndDelete(reviewId);

        console.log("Review deleted");
        req.flash("success", "Review deleted!");

        res.redirect(`/listings/${id}`);
    })
);


module.exports = router;