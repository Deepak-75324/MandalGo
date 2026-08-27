const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.index = async (req, res) => {

    const count = await Listing.countDocuments();

    const allListings = await Listing.aggregate([
        { $sample: { size: count } }
    ]);

    res.render("listing/index.ejs", {
        allListings,
        title: "Explore Listings | MandalGo"
    });

};

module.exports.newListingForm = (req, res) => {
    res.render("listing/new.ejs", {
        title: "Add Listing | MandalGo"
    });

};

module.exports.newListingPost = async (req, res) => {

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing added!");
        res.redirect("/listings");

    
};

module.exports.showListing = async (req, res) => {

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
};
// Edit form 
module.exports.editListing = async (req, res) => {

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

};
// Edit form Post request
module.exports.updateListing = async (req, res) => {

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
};

// DELETE LISTING
module.exports.deleteListing = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        // Delete listing
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
}