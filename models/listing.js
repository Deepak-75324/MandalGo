const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { listingSchema } = require("../schema");

const ListingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        // Image can be uploaded or provided through a URL
        image: {
            url: String,
            filename: String
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        country: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "Hotel",
                "Villa",
                "Apartment",
                "Resort",
                "Guesthouse",
                "Hostel",
                "Tourist place",
                "Home",
                "Mountain",
                "Other",
            ],
            default: "Hotel"
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 3.5
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        owner: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
    }
);

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

module.exports = mongoose.model("Listing", ListingSchema);
// const Listing = mongoose.model("Listing", ListingSchema);

// module.exports = Listing;

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ListingSchema = new Schema({
//     title: String,
//     description: String,
//     image: String,
//     price: Number,
//     location: String,
//     country: String
// });

// const Listing = mongoose.model('Listing', ListingSchema);

// modules.export = Listing;