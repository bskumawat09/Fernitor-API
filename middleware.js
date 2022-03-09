const { productSchema, userSchema, reviewSchema } = require("./schema");
const AppError = require("./utils/appError");
const tokenService = require("./services/token-service");
const userService = require("./services/user-service");
const reviewService = require("./services/review-service");

// middleware for authentication
module.exports.isLoggedIn = async (req, res, next) => {
	const { jwtToken } = req.cookies;
	// if token not found in cookie
	if (!jwtToken) {
		return next(new AppError("you are not authenticated, please login", 403));
	}
	const decodedToken = tokenService.verifyToken(jwtToken);
	// if token does not verify
	if (!decodedToken) {
		return next(new AppError("invalid token", 400));
	}
	const user = await userService.findOneUser({ _id: decodedToken.id });
	// if corresponding user not found
	if (!user) {
		return next(
			new AppError("user belong to this token no longer exists", 404)
		);
	}
	req.user = decodedToken;
	console.log("req.user", req.user);
	next();
};

module.exports.isAuthor = (req, res, next) => {
	if (req.user.role === "admin" || req.params.uid === req.user.id) {
		return next();
	}
	next(new AppError("you are not authorized to perform this operation", 403));
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { rid } = req.params;

	const review = await reviewService.findOneReview({ _id: rid });
	if (req.user.role === "admin" || review.authorId.equals(req.user.id)) {
		return next();
	}
	next(new AppError("you are not authorized to perform this operation", 403));
};

// middleware for doing role-based permissions
module.exports.permit = function (...permittedRoles) {
	return async (req, res, next) => {
		if (permittedRoles.includes(req.user.role)) {
			return next();
		}
		next(new AppError("you do not have permission", 403));
	};
};

module.exports.validateProduct = (req, res, next) => {
	const { error } = productSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((ele) => ele.message).join(",");
		next(new AppError(msg));
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((ele) => ele.message).join(",");
		next(new AppError(msg));
	} else {
		next();
	}
};

module.exports.validateUser = (req, res, next) => {
	const { error } = userSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((ele) => ele.message).join(",");
		next(new AppError(msg));
	} else {
		next();
	}
};
