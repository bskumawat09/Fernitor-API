const express = require('express');
const Review = require('../models/review');
const Product = require('../models/product');
const { isLoggedIn, validateReview } = require('../middleware');

const router = express.Router({ mergeParams: true });

// create review
router.post('/', isLoggedIn, validateReview, async (req, res) => {
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.json({
        message: "added new review",
        review: review
    });
});

// delete review
router.delete('/:reviewId', isLoggedIn, async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "review deleted" });
});

module.exports = router;

