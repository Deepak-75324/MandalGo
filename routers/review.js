const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuther } = require("../middleware.js");
const { validateReview} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/review.js");

// CREATE REVIEW
// POST /listings/:id/reviews
router.post(
    "/",
    isLoggedIn,
    wrapAsync(createReview)
);

// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuther,
    wrapAsync(destroyReview)
);


module.exports = router;