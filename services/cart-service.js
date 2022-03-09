const Cart = require("../models/cart-model");

class CartService {
	async findCart(filter) {
		const cart = await Cart.findOne(filter);
		return cart;
	}

	async createCart() {
		const cart = await Cart.create();
		return cart;
	}
}

module.exports = new CartService();
