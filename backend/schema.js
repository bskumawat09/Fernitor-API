const Joi = require('joi');

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        description: Joi.string().max(50),
        quantity: Joi.number().min(0).integer().required()
    }).required().unknown(true)
});

module.exports.userSchema = Joi.object({
    user: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().length(10),
        address: Joi.string().max(20),
        country: Joi.string().max(10)
    }).required().unknown(true)
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        description: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required()
    }).required().unknown(true)
});