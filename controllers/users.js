const User = require("../models/user")
const Product = require("../models/product")
const Cart = require("../models/cart")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

module.exports.getUsers = catchAsync(async (req, res) => {
	const query = req.query.new
	const users = query
		? await User.find().limit(5).sort({ createdAt: -1 })
		: await User.find()

	const usrs = users.map((user) => {
		const { password, ...others } = user._doc
		return others
	})

	res.status(200).json({
		status: "success",
		results: users.length,
		users: usrs,
	})
})

module.exports.getUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.uid).select("-password")
	if (!user) {
		return next(new AppError("user not found", 404))
	}
	res.status(200).json({
		status: "success",
		user: user,
	})
})

module.exports.updateUser = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.params.uid,
		{ $set: req.body.user },
		{ new: true }
	)

	if (!updatedUser) {
		return next(new AppError("user not found", 404))
	}

	res.status(201).json({
		status: "success",
		message: "user updated successfully",
		user: updatedUser,
	})
})

module.exports.getUserCart = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.uid)
	if (!user) {
		return next(new AppError("user not found", 404))
	}

	const products = []
	for (let item of user.cart.items) {
		const product = await Product.findById(item.product._id).select(
			"-createdAt -updatedAt"
		)
		const obj = Object.assign({ quantity: item.quantity }, { ...product._doc })
		products.push(obj)
	}
	// const cart = await Cart.findById(user.cart);

	res.status(200).json({
		status: "success",
		results: products.length,
		cart: {
			amount: user.cart.amount,
			products: products,
		},
	})
})

module.exports.addToCart = catchAsync(async (req, res) => {
	const { uid } = req.params
	const { item } = req.body
	const user = await User.findById(uid)
	const updatedCart = await Cart.findByIdAndUpdate(user.cart, {
		$push: { items: item },
	})
	updatedCart.amount += item.product.price * item.quantity
	await updatedCart.save()
	await user.save()

	res.status(200).json({
		status: "success",
		cart: updatedCart,
	})
})

module.exports.removeFromCart = catchAsync(async (req, res, next) => {
	const { uid, pid } = req.params
	const user = await User.findById(uid)
	const cart = await Cart.findById(user.cart)

	const removeItems = cart.items.filter((item) => item.product._id.equals(pid))
	if (removeItems.length === 0) {
		return next(new AppError("item not found in cart", 404))
	}
	await Cart.updateOne(
		{ _id: cart._id },
		{
			$pull: { items: { product: pid } },
		}
	)
	removeItems.forEach((item) => {
		cart.amount -= item.product.price * item.quantity
	})
	await cart.save()
	await user.save()

	res.status(200).json({
		status: "success",
		message: "product removed successfully",
		products: removeItems,
	})
})

// get registered users by months
module.exports.getUserStats = catchAsync(async (req, res) => {
	const date = new Date()
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

	const data = await User.aggregate([
		{
			$match: {
				createdAt: { $gte: lastYear },
			},
		},
		{
			$project: {
				month: { $month: "$createdAt" },
			},
		},
		{
			$group: {
				_id: "$month",
				total: { $sum: 1 },
			},
		},
	])

	res.status(200).json({
		staus: "success",
		data: data,
	})
})
