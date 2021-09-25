const express = require('express');
const Review = require('../models/review');
const Product = require('../models/product');
const { isLoggedIn, validateReview } = require('../middleware');

const router = express.Router({ mergeParams: true });

// create review
router.post('/', isLoggedIn, validateReview, async (req, res) => {
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    review.product = product._id;

    await review.save();
    await product.save();

    res.status(201).json({
        status: "success",
        message: "added new review",
        review: review
    });
});

// delete review
router.delete('/:reviewId', isLoggedIn, async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);

    res.status(201).json({
        status: "success",
        message: "review deleted"
    });
});

module.exports = router;

