const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('user not found', 404));
    }
    res.status(200).json({
        status: 'success',
        user: user
    });
})

module.exports.getUserCart = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('user not found', 404));
    }

    const products = [];
    for (let item of user.cart.items) {
        const product = await Product.findById(item._id);
        products.push(product);
    }
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
    let quantity = 1;
    const product = await Product.findById(pid);
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('user not found', 404));
    }

    if (!user.cart) {
        user.cart = new Cart();
        user.cart.items.push({ _id: pid, quantity });
        user.cart.bill += quantity * product.price;
        await user.cart.save();
    }
    else {
        const cart = await Cart.findById(user.cart);
        cart.items.push({ _id: pid, quantity });
        cart.bill += quantity * product.price;
        await cart.save();
    }
    await user.save();
    res.status(201).json({
        status: 'success',
        message: 'product added to cart successfully'
    });
})

// module.exports.removeFromCart = catchAsync(async (req, res, next) => {
//     const { id, pid } = req.params;
//     const user = await User.findById(id);
//     if (!user) {
//         next(new AppError('user not found', 404));
//     }
//     // const cart = await Cart.findById(user.cart);
//     await Cart.findByIdAndUpdate(user.cart, { $pull: { product: pid } })    // TODO: Remove from cart
//     res.status(201).redirect(`/users/${id}/cart`);
// })

module.exports.getUserProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find({ seller: req.params.id });
    res.status(200).json({
        status: 'success',
        result: products.length,
        products: products
    });
})