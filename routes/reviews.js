const express = require("express")
const reviewController = require("../controllers/reviews")
const {
	isLoggedIn,
	permit,
	validateReview,
	isAuthor,
	isReviewAuthor,
} = require("../middleware")

const router = express.Router({ mergeParams: true })

// get all reviews
router.get("/", isLoggedIn, permit("admin"), reviewController.getReviews)

// get all reviews associated with product
router.get("/products/:pid", reviewController.getProductReviews)

// get all reviews associated with user
router.get("/users/:uid", isLoggedIn, isAuthor, reviewController.getUserReviews)

// create review
router.post(
	"/products/:pid",
	isLoggedIn,
	permit("user"),
	validateReview,
	reviewController.addReview
)

// delete review
router.delete(
	"/:rid",
	isLoggedIn,
	isReviewAuthor,
	permit("user"),
	reviewController.deleteReview
)

module.exports = router
