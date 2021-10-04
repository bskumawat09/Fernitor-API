const jwt = require('jsonwebtoken');
const { productSchema, userSchema, reviewSchema } = require('./schema');
const User = require('./models/user');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');

// middleware for authentication
module.exports.isLoggedIn = (req, res, next) => {
    const secret = process.env.SECRET;
    // const token = req.cookies.jwt;
    const authHeader = req.headers.token;

    if (!authHeader) {
        return next(new AppError('you are not authenticated, please login', 403));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, secret, catchAsync(async (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            return next(new AppError(err.message, 400));
        }

        const loggedUser = await User.findById(decodedToken.id);
        // if the user belonging to this token no longer exists
        if (!loggedUser) {
            return next(new AppError('user belonging to this token no longer exists', 404));
        }
        req.user = decodedToken;
        console.log("req.user", req.user);

        next();
    }));
}

module.exports.isAuthor = (req, res, next) => {
    if (req.user.role === "admin" || req.params.uid === req.user.id) {
        return next();
    }
    next(new AppError('you are not authorized person', 403));
}

// middleware for doing role-based permissions
module.exports.permit = function (...permittedRoles) {
    return async (req, res, next) => {
        const { user } = req;
        if (permittedRoles.includes(user.role)) {
            return next();
        }
        next(new AppError('you do not have permission', 403));
    }
}

module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        next(new AppError(msg));
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        next(new AppError(msg));
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        next(new AppError(msg));
    } else {
        next();
    }
}