const User = require("../models/user-model");
const cartService = require("./cart-service");

class UserService {
	async findOneUser(filter) {
		const user = await User.findOne(filter);
		return user;
	}

	async createUser(data) {
		const user = await User.create(data);
		user.cartId = await cartService.createCart();
		await user.save();
		return user;
	}

	async updateUser(filter, data) {
		const user = await User.findOneAndUpdate(
			filter,
			{ $set: data },
			{ new: true }
		);
		return user;
	}

	async findUsers({ sort }) {
		const users =
			sort === "new"
				? await User.find().sort({ createdAt: -1 })
				: await User.find();
		return users;
	}
}

module.exports = new UserService();
