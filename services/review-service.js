const Review = require("../models/review-model");

class ReviewService {
	async findOneReview(filter) {
		const review = await Review.findOne(filter);
		return review;
	}

	async createReview(data) {
		const review = await Review.create(data);
		return review;
	}

	async findReviews(filter) {
		const reviews = await Review.find(filter);
		return reviews;
	}

	async deleteReview(filter) {
		const review = await Review.findOneAndDelete(filter);
		return review;
	}
}

module.exports = new ReviewService();
