const express = require('express');
const Product = require('../models/product');
const { productSchema } = require('../schema');

const router = express.Router();

// schema validation (server-side) with joi
const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new Error(msg);
    } else {
        next();
    }
}

// get all products (tested)
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json({ products: products });
})

// create new product (tested)
router.post('/', validateProduct, async (req, res) => {
    const newProduct = new Product(req.body.product);
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
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { product } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: product }, { new: true });
    res.json({ product: updatedProduct });
})

// delete product (tested)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "product is deleted" });
})

// get all products with given category (tested)
router.get('/category/:category', async (req, res) => {
    const { category } = req.params;
    const products = await Product.find({ category: category });
    if (!products) {
        return res.json({ message: 'no product found for this category' });
    }
    res.json({ products: products });
})

// add product to cart (tested)
router.put('/:id/cart', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('seller');
    const user = product.seller;    // TODO: replace by current logged in user
    user.cart.push(id);
    await user.save();
    res.json({
        message: "added product to cart",
        product: product
    });
})

module.exports = router;
