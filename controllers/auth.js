const User = require('../models/user');
const Cart = require('../models/cart');
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

    // create cart for each new user
    newUser.cart = new Cart();
    await newUser.cart.save();
    await newUser.save();

    const registeredUser = await User.login(user.email, user.password);

    const token = createToken(newUser._id, newUser.role);
    res.cookie('jwt', token, { httpOnly: true });

    res.status(201).json({
        status: "success",
        message: "registered successfully",
        user: registeredUser
    });
})

module.exports.registerSeller = catchAsync(async (req, res) => {
    const { seller } = req.body;
    seller.role = 'seller';
    const newSeller = new User(seller);
    await newSeller.save();

    await User.login(seller.email, seller.password);

    const token = createToken(newSeller._id, newSeller.role);
    res.cookie('jwt', token, { httpOnly: true });

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