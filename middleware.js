const jwt = require('jsonwebtoken');
const { productSchema, userSchema, reviewSchema } = require('./schema');
const User = require('./models/user');
const AppError = require('./utils/appError');

module.exports.isLoggedIn = (req, res, next) => {
    const secret = process.env.SECRET;
    const token = req.cookies.jwt;

    if (!token) {
        return next(new AppError('you are not authorized, please login', 403));
    }

    jwt.verify(token, secret, async function (err, decodedToken) {
        if (err) {
            console.log(err.message);
            return next(new AppError(err.message, 400));
        }
        console.log(decodedToken);

        const loggedUser = await User.findById(decodedToken.id);
        // if the user belonging to this token no longer exists
        if (!loggedUser) {
            return next(new AppError('user belonging to this token no longer exists', 404));
        }
        next();
    });
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