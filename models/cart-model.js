const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
	items: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				ref: "Product"
			},
			quantity: {
				type: Number,
				min: [1, "quantity can not be less than 1"],
				default: 1
			}
		}
	],
	amount: {
		type: Number,
		default: 0
	}
});

// query middleware
cartSchema.pre(/^find/, function (next) {
	this.populate({
		path: "items.productId"
	});
	next();
});

module.exports = mongoose.model("Cart", cartSchema, "carts");
