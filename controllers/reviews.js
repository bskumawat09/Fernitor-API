const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const reviewService = require("../services/review-service");
const productService = require("../services/product-service");

module.exports.getReviews = catchAsync(async (req, res) => {
	const reviews = await reviewService.findReviews();

	res.status(200).json({
		status: "success",
		results: reviews.length,
		reviews
	});
});

module.exports.getProductReviews = catchAsync(async (req, res) => {
	const { pid } = req.params;

	const reviews = await reviewService.findReviews({ productId: pid });

	res.status(200).json({
		status: "success",
		results: reviews.length,
		reviews
	});
});

module.exports.getUserReviews = catchAsync(async (req, res) => {
	const { uid } = req.params;

	const reviews = await reviewService.findReviews({ authorId: uid });

	res.status(200).json({
		status: "success",
		results: reviews.length,
		reviews
	});
});

module.exports.addReview = catchAsync(async (req, res) => {
	const { pid } = req.params;
	const { review } = req.body;

	const product = await productService.findOneProduct({ _id: pid });
	if (!product) {
		next(new AppError("product not found", 404));
	}
	const newReview = await reviewService.createReview({
		...review,
		productId: pid,
		authorId: req.user.id
	});

	res.status(201).json({
		status: "success",
		review: newReview
	});
});

module.exports.deleteReview = catchAsync(async (req, res) => {
	const { rid } = req.params;

	const review = await reviewService.deleteReview({ _id: rid });

	res.status(201).json({
		status: "success",
		review
	});
});
