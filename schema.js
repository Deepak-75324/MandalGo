const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),

        description: Joi.string().required(),

        location: Joi.string().required(),

        country: Joi.string().required(),

        price: Joi.number()
            .required()
            .min(0),

        image: Joi.alternatives().try(
            Joi.string().allow("", null),
            Joi.object({
                url: Joi.string().allow("", null),
                filename: Joi.string().allow("", null)
            })
        ),

        category: Joi.string()
            .valid(
                "Hotel",
                "Villa",
                "Apartment",
                "Resort",
                "Guesthouse",
                "Hostel",
                "Tourist place"
            )
            .default("Hotel"),

        rating: Joi.number()
            .min(0)
            .max(5)
            .default(4.0)

    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
        .required()
        .min(1)
        .max(5),

        comment: Joi.string()
        .trim()
        .required()
        .min(1),
    }).required()
});