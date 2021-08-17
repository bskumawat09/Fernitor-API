const express = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { isLoggedIn, validateProduct } = require('../middleware');

const router = express.Router();

// get all products (tested)
router.get('/', async (req, res) => {
    // for filtering
    let queryObj = { ...req.query }; // make a copy (not reference) of query object
    const exclude = ['sort', 'limit', 'page'];
    exclude.forEach(el => delete queryObj[el]);

    // for advance filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    queryObj = JSON.parse(queryString);

    const products = await Product.find(queryObj);
    res.json({ products: products });
})

// create new product (tested)
router.post('/', isLoggedIn, validateProduct, async (req, res) => {
    const { product } = req.body;
    const newProduct = new Product(product);
    await newProduct.save();
    res.json({ product: newProduct });
})

// get single product (tested)
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller').populate('reviews');
    if (!product) {
        return res.json({ message: 'product not found' });
    }
    res.json({ product: product });
})

// edit product (tested)
router.put('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { product } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: product }, { new: true });
    res.json({ product: updatedProduct });
})

// delete product (tested)
router.delete('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "product is deleted" });
})

// add product to cart
router.post('/:id/cart', isLoggedIn, async (req, res) => {
    const { id } = req.params;  // product id
    const { quantity } = req.body;
    const product = await Product.findById(id).populate({
        path: 'seller',
        populate: { path: 'cart' }
    });
    const user = product.seller;    // TODO: replace by current logged in user
    if (!user.cart) {
        user.cart = new Cart();
    }
    user.cart.items.push({ _id: id, quantity });
    user.cart.bill += quantity * product.price;

    await user.cart.save();
    await user.save();

    res.json({
        message: "product added to cart",
        cart: user.cart,
    });
})

module.exports = router;
