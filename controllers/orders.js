const Order = require("../models/order")
const catchAsync = require("../utils/catchAsync")

module.exports.getUserOrders = catchAsync(async (req, res) => {
	const { uid } = req.params
	const orders = await Order.find({ user: uid }).sort({ createdAt: -1 })

	res.status(200).json({
		status: "success",
		results: orders.length,
		orders: orders,
	})
})

module.exports.createOrder = catchAsync(async (req, res) => {
	const order = new Order(req.body.order)
	order.user = req.user.id

	await order.save()

	res.status(200).json({
		status: "success",
		results: order.length,
		order: order,
	})
})

module.exports.editOrder = catchAsync(async (req, res) => {
	const { oid } = req.params
	const updatedOrder = await Order.findByIdAndUpdate(
		oid,
		{
			$set: req.body.order,
		},
		{ new: true }
	)

	res.status(200).json({
		status: "success",
		results: updatedOrder.length,
		order: updatedOrder,
	})
})

module.exports.deleteOrder = catchAsync(async (req, res) => {
	const { oid } = req.params
	const order = await Order.findByIdAndDelete(oid)

	res.status(200).json({
		status: "success",
		results: order.length,
		order: order,
	})
})

module.exports.getMonthlySales = catchAsync(async (req, res) => {
	const date = new Date()
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

	const income = await Order.aggregate([
		{
			$match: {
				createdAt: { $gte: previousMonth },
			},
		},
		{
			$project: {
				month: { $month: "$createdAt" },
				sales: "$amount",
			},
		},
		{
			$group: {
				_id: "$month",
				total: { $sum: "$sales" },
			},
		},
	])

	res.status(200).json({
		status: "success",
		income: income,
	})
})
