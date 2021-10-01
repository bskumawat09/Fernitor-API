const Review = require('../models/review');
const Product = require('../models/product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: "success",
        results: reviews.length,
        reviews: reviews
    });
})

module.exports.getProductReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find({ product: req.params.pid });

    res.status(200).json({
        status: "success",
        results: reviews.length,
        reviews: reviews
    });
})

module.exports.getUserReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find({ author: req.params.uid });

    res.status(200).json({
        status: "success",
        results: reviews.length,
        reviews: reviews
    });
})

module.exports.addReview = catchAsync(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    if (!product) {
        next(new AppError('product not found', 404));
    }
    const review = new Review(req.body.review);
    review.author = req.user.id;
    review.product = pid;

    await review.save();
    // await product.save();

    res.status(201).json({
        status: "success",
        review: review
    });
})

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { rid } = req.params;
    const review = await Review.findByIdAndDelete(rid);

    res.status(201).json({
        status: "success",
        review: {
            review: review.description
        }
    });
})
