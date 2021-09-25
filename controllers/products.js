const Product = require('../models/product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getProducts = catchAsync(async (req, res) => {
    // for filtering
    let queryObj = { ...req.query }; // make a copy (not reference) of query object
    const exclude = ['sort', 'limit', 'page'];
    exclude.forEach(el => delete queryObj[el]);

    // for advance filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    queryObj = JSON.parse(queryString);

    const products = await Product.find(queryObj);
    res.status(200).json({
        status: 'success',
        result: products.length,
        products: products
    });
})

module.exports.addNewProduct = catchAsync(async (req, res) => {
    const { product } = req.body;
    product.seller = req.user.id;

    const newProduct = new Product(product);
    const imgFile = req.file;
    if (imgFile) {
        newProduct.image = { url: imgFile.path, filename: imgFile.filename };
    }
    await newProduct.save();
    res.status(201).json({
        status: 'success',
        product: newProduct
    });
})

module.exports.getSingleProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',  // review's author
            select: '-__v -password -createdAt -updatedAt'
        }
    });
    if (!product) {
        return next(new AppError('product not found', 404));
    }
    res.status(200).json({
        status: 'success',
        product: product
    });
})

module.exports.editProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { product } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: product }, { new: true });

    if (!updatedProduct) {
        return next(new AppError('product not found', 404));
    }
    const imgFile = req.file;
    if (imgFile) {
        updatedProduct.image = { url: imgFile.path, filename: imgFile.filename };
        await updatedProduct.save();
    }
    res.status(201).json({
        status: 'success',
        product: updatedProduct
    });
})

module.exports.removeProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return next(new AppError('product not found', 404));
    }
    res.status(201).json({
        status: 'success',
        message: "product is deleted"
    });
})