const Order = require("../models/order-model");
const orderService = require("../services/order-service");
const catchAsync = require("../utils/catchAsync");

module.exports.getUserOrders = catchAsync(async (req, res) => {
	const { uid } = req.params;

	const orders = await orderService.findOrders({ userId: uid });

	res.status(200).json({
		status: "success",
		results: orders.length,
		orders
	});
});

module.exports.createOrder = catchAsync(async (req, res) => {
	const { order } = req.body;

	const newOrder = await orderService.createOrder({
		...order,
		userId: req.user.id
	});

	res.status(200).json({
		status: "success",
		results: newOrder.length,
		order: newOrder
	});
});

module.exports.editOrder = catchAsync(async (req, res) => {
	const { oid } = req.params;
	const { order } = req.body;

	const updatedOrder = await orderService.updateOrder({ _id: oid }, order);

	res.status(200).json({
		status: "success",
		results: updatedOrder.length,
		order: updatedOrder
	});
});

module.exports.deleteOrder = catchAsync(async (req, res) => {
	const { oid } = req.params;

	const order = await orderService.deleteOrder({ _id: oid });

	res.status(200).json({
		status: "success",
		results: order.length,
		order
	});
});

module.exports.getMonthlySales = catchAsync(async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	const income = await Order.aggregate([
		{
			$match: {
				createdAt: { $gte: previousMonth }
			}
		},
		{
			$project: {
				month: { $month: "$createdAt" },
				sales: "$amount"
			}
		},
		{
			$group: {
				_id: "$month",
				total: { $sum: "$sales" }
			}
		}
	]);

	res.status(200).json({
		status: "success",
		income: income
	});
});
