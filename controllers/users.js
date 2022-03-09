const User = require("../models/user-model");
const Cart = require("../models/cart-model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const userService = require("../services/user-service");
const productService = require("../services/product-service");
const cartService = require("../services/cart-service");

module.exports.getUsers = catchAsync(async (req, res) => {
	const { sort } = req.query;
	const users = await userService.findUsers({ sort });

	const usrs = users.map((user) => {
		const { password, ...others } = user._doc;
		return others;
	});

	res.status(200).json({
		status: "success",
		results: users.length,
		users: usrs
	});
});

module.exports.getUser = catchAsync(async (req, res, next) => {
	const { uid } = req.params;

	const user = await userService.findOneUser({ _id: uid });
	if (!user) {
		return next(new AppError("user not found", 404));
	}

	res.status(200).json({
		status: "success",
		user: user
	});
});

module.exports.updateUser = catchAsync(async (req, res, next) => {
	const { uid } = req.params;
	const { user } = req.body;

	const updatedUser = await userService.updateUser({ _id: uid }, user);
	if (!updatedUser) {
		return next(new AppError("user not found", 404));
	}

	res.status(201).json({
		status: "success",
		message: "user updated successfully",
		user: updatedUser
	});
});

module.exports.getUserCart = catchAsync(async (req, res, next) => {
	const { uid } = req.params;

	const user = await userService.findOneUser({ _id: uid });
	if (!user) {
		return next(new AppError("user not found", 404));
	}

	const products = [];
	for (let item of user.cartId.items) {
		const product = await productService.findOneProduct({
			_id: item.productId._id
		});
		const obj = Object.assign({ quantity: item.quantity }, { ...product._doc });
		products.push(obj);
	}
	// const cart = await Cart.findById(user.cart);

	res.status(200).json({
		status: "success",
		results: products.length,
		cart: {
			amount: user.cartId.amount,
			products
		}
	});
});

module.exports.addToCart = catchAsync(async (req, res) => {
	const { uid } = req.params;
	const { item } = req.body;

	const user = await userService.findOneUser({ _id: uid });
	const updatedCart = await Cart.findByIdAndUpdate(user.cart, {
		$push: { items: item }
	});
	updatedCart.amount += item.product.price * item.quantity;
	await updatedCart.save();
	await user.save();

	res.status(200).json({
		status: "success",
		cart: updatedCart
	});
});

module.exports.removeFromCart = catchAsync(async (req, res, next) => {
	const { uid, pid } = req.params;

	const user = await userService.findOneUser({ _id: uid });
	const cart = await cartService.findCart({ _id: user.cartId });

	const removeItems = cart.items.filter((item) => item.product._id.equals(pid));
	if (removeItems.length === 0) {
		return next(new AppError("item not found in cart", 404));
	}
	await Cart.updateOne(
		{ _id: cart._id },
		{
			$pull: { items: { product: pid } }
		}
	);
	removeItems.forEach((item) => {
		cart.amount -= item.product.price * item.quantity;
	});
	await cart.save();
	await user.save();

	res.status(200).json({
		status: "success",
		message: "product removed successfully",
		products: removeItems
	});
});

// get registered users by months
module.exports.getUserStats = catchAsync(async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

	const data = await User.aggregate([
		{
			$match: {
				createdAt: { $gte: lastYear }
			}
		},
		{
			$project: {
				month: { $month: "$createdAt" }
			}
		},
		{
			$group: {
				_id: "$month",
				total: { $sum: 1 }
			}
		}
	]);

	res.status(200).json({
		staus: "success",
		data: data
	});
});
