const Joi = require("joi");

module.exports.productSchema = Joi.object({
	product: Joi.object({
		name: Joi.string().required(),
		price: Joi.number().min(0).required(),
		description: Joi.string().max(300),
		color: Joi.string().required()
	})
		.required()
		.unknown(true)
});

module.exports.userSchema = Joi.object({
	user: Joi.object({
		name: Joi.string().required(),
		email: Joi.string().required(),
		password: Joi.string().min(6).required(),
		phone: Joi.string().min(10).max(13),
		address: Joi.string().max(30),
		country: Joi.string().max(15)
	})
		.required()
		.unknown(true)
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		description: Joi.string().required(),
		rating: Joi.number().min(0).max(5).required()
	})
		.required()
		.unknown(true)
});
