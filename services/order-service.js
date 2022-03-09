const Order = require("../models/order-model");

class OrderService {
	async findOrders(filter) {
		const orders = await Order.find(filter).sort({ createdAt: -1 });
		return orders;
	}

	async createOrder(data) {
		const order = await Order.create(data);
		return order;
	}

	async updateOrder(filter, data) {
		const order = await Order.findOneAndUpdate(
			{ filter },
			{ $set: data },
			{ new: true }
		);
		return order;
	}

	async deleteOrder(filter) {
		const order = await Order.findOneAndDelete(filter);
		return order;
	}
}

module.exports = new OrderService();
