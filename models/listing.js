const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    // Cloudinary image
    image: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
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

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point",
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
        },
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
            "Other"
        ],
        default: "Other"
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
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

// MongoDB geospatial index
// ListingSchema.index({ geometry: "2dsphere" });

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

module.exports = mongoose.model("Listing", ListingSchema);