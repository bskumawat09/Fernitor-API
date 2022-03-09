const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product"
				},
				quantity: {
					type: Number,
					required: true,
					min: [1, "quantity can not be less then 1"]
				}
			}
		],
		amount: {
			type: Number,
			required: true
		},
		address: {
			type: String,
			required: true
		},
		status: {
			type: String,
			default: "pending",
			lowercase: true
		}
	},
	{ timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
	this.populate({
		path: "items.productId"
	});
	next();
});

module.exports = mongoose.model("Order", orderSchema, "orders");
