const express = require('express');
const reviewController = require('../controllers/reviews');
const { isLoggedIn, permit, validateReview } = require('../middleware');

const router = express.Router({ mergeParams: true });

// get all reviews
router.get('/',
    isLoggedIn,
    permit('admin'),
    reviewController.getReviews
);

// get all reviews associated with product
router.get('/products/:pid',
    reviewController.getProductReviews
);

// get all reviews associated with user
router.get('/users/:uid',
    isLoggedIn,
    permit('admin'),
    reviewController.getUserReviews
);

// create review
router.post('/products/:pid',
    isLoggedIn,
    permit('user'),
    validateReview,
    reviewController.addReview
);

// delete review
router.delete('/:rid',
    isLoggedIn,
    permit('user'),
    reviewController.deleteReview
);

module.exports = router;
