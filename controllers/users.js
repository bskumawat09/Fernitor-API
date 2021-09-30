const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return next(new AppError('user not found', 404));
    }
    res.status(200).json({
        status: 'success',
        user: user
    });
})

module.exports.getUserCart = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('user not found', 404));
    }

    const products = [];
    for (let item of user.cart.items) {
        const product = await Product.findById(item._id).select('-createdAt -updatedAt -seller');
        products.push(product);
    }

    // const cart = await Cart.findById(user.cart);

    res.status(200).json({
        status: 'success',
        result: products.length,
        cart: {
            amount: user.cart.bill,
            products: products
        }
    });
})

module.exports.addToCart = catchAsync(async (req, res) => {
    const { pid } = req.params;
    let quantity = req.body.quantity || 1;
    const product = await Product.findById(pid);

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('user not found', 404));
    }

    const cart = await Cart.findById(user.cart);
    cart.items.push({ _id: pid, quantity });
    cart.bill += quantity * product.price;

    await cart.save();
    await user.save();

    res.status(201).json({
        status: 'success',
        message: 'product added to cart successfully',
        product: {
            name: product.name,
            price: product.price
        }
    });
})

module.exports.removeFromCart = catchAsync(async (req, res, next) => {
    const { pid } = req.params;
    const user = await User.findById(req.user.id);

    const product = await Product.findById(pid);
    //TODO: If product does not exist in cart then we should not able to delete it

    const cart = await Cart.findByIdAndUpdate(user.cart, { $pull: { items: { _id: pid } } });
    cart.bill = cart.bill - product.price;

    cart.save();
    user.save();

    res.status(200).json({
        status: 'success',
        message: 'product removed successfully',
        product: {
            name: product.name,
            price: product.price
        }
    });
})

module.exports.getUserProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find({ seller: req.params.id });

    res.status(200).json({
        status: 'success',
        result: products.length,
        products: products
    });
})