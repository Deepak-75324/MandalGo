const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../schema.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// ===============================
// Review validation
// ===============================

const validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// ===============================
// CREATE REVIEW
// POST /listings/:id/reviews
// ===============================

router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {

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
    })
);


// ===============================
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// ===============================

router.delete(
    "/:reviewId",
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

        res.redirect(`/listings/${id}`);
    })
);


module.exports = router;