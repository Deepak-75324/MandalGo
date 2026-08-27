const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {

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
};

module.exports.destroyReview = async (req, res) => {

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
}