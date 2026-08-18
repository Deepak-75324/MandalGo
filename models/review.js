const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    created_At: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Review", reviewSchema);