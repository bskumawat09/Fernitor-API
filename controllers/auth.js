const User = require('../models/user');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createToken = (id, role) => {
    const secret = process.env.SECRET;
    return jwt.sign({ id, role }, secret, { expiresIn: 24 * 60 * 60 });
}

module.exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body.user;
    if (!email || !password) {
        return next(new AppError('please provide email and password', 400));
    }
    const user = await User.login(email, password);

    const token = createToken(user._id, user.role);
    res.cookie('jwt', token, { httpOnly: true });

    res.status(201).json({
        status: "success",
        message: "login successful",
        user: user
    });
})

module.exports.register = catchAsync(async (req, res) => {
    const { user } = req.body;
    const newUser = new User(user);
    await newUser.save();

    await User.login(user.email, user.password);

    const token = createToken(newUser._id, newUser.role);
    res.cookie('jwt', token, { httpOnly: true });

    res.status(201).json({
        status: "success",
        message: "registered successfully",
        user: newUser
    });
})

module.exports.registerSeller = catchAsync(async (req, res) => {
    const { seller } = req.body;
    seller.role = 'seller';
    const newSeller = new User(seller);
    await newSeller.save();

    await User.login(user.email, user.password);

    res.status(201).json({
        status: "success",
        message: "registered successfully",
        seller: newSeller
    })
})

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({
        status: "success",
        message: "logged out"
    });
}