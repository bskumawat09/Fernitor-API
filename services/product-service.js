const Product = require("../models/product-model");

class ProductService {
	async findOneProduct(filter) {
		const product = await Product.findOne(filter).populate({
			path: "reviews",
			populate: {
				path: "authorId", // review's author
				select: "-__v -password -createdAt -updatedAt"
			}
		});
		return product;
	}

	async createProduct(data) {
		const product = await Product.create(data);
		return product;
	}

	async updateProduct(filter, data) {
		const product = await Product.findOneAndUpdate(
			filter,
			{ $set: data },
			{ new: true }
		);
		return product;
	}

	async findProducts({ queryObj, sort }) {
		let products;
		if (sort === "new") {
			products = await Product.find(queryObj).sort({ createdAt: -1 });
		} else if (sort === "asc") {
			products = await Product.find(queryObj).sort({ price: 1 });
		} else if (sort === "desc") {
			products = await Product.find(queryObj).sort({ price: -1 });
		} else {
			products = await Product.find(queryObj);
		}
		return products;
	}

	async deleteProduct(filter) {
		const product = await Product.findOneAndDelete(filter);
		return product;
	}
}

module.exports = new ProductService();
