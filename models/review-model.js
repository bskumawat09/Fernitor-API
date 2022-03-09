const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
	{
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5
		},
		description: {
			type: String,
			required: true
		},
		authorId: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product"
		}
	},
	{ timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: "authorId",
		select: "name email -cart"
	});
	next();
});

module.exports = mongoose.model("Review", reviewSchema, "reviews");
