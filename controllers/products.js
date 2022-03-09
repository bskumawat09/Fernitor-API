const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const productService = require("../services/product-service");

module.exports.getProducts = catchAsync(async (req, res) => {
	// for filtering
	const { sort } = req.query;
	let queryObj = { ...req.query }; // make a copy (not reference) of query object
	const exclude = ["sort", "limit", "page"];
	exclude.forEach((el) => delete queryObj[el]);

	// for advance filtering
	let queryString = JSON.stringify(queryObj);
	queryString = queryString.replace(
		/\b(gte|gt|lte|lt)\b/g,
		(match) => `$${match}`
	);
	queryObj = JSON.parse(queryString);

	const products = await productService.findProducts({ queryObj, sort });

	res.status(200).json({
		status: "success",
		results: products.length,
		products: products
	});
});

// module.exports.getProductsByCategory = catchAsync(async (req, res) => {
//     const { category } = req.params;
//     const { featured } = req.query;

//     const products = featured
//         ? await Product.find({ isFeatured: true })
//         : await Product.find({ categories: { $in: [category] } });

//     res.status(200).json({
//         status: 'success',
//         results: products.length,
//         products: products
//     });
// })

module.exports.addNewProduct = catchAsync(async (req, res) => {
	const { product } = req.body;
	const imgFile = req.file;

	if (imgFile) {
		product.image = { url: imgFile.path, filename: imgFile.filename };
	}
	const newProduct = await productService.createProduct(product);

	res.status(201).json({
		status: "success",
		product: newProduct
	});
});

module.exports.getSingleProduct = catchAsync(async (req, res, next) => {
	const { pid } = req.params;

	const product = await productService.findOneProduct({ _id: pid });
	if (!product) {
		return next(new AppError("product not found", 404));
	}

	res.status(200).json({
		status: "success",
		product: product
	});
});

module.exports.editProduct = catchAsync(async (req, res, next) => {
	const { pid } = req.params;
	const { product } = req.body;
	const imgFile = req.file;

	if (imgFile) {
		product.image = { url: imgFile.path, filename: imgFile.filename };
	}
	const updatedProduct = await productService.updateProduct(
		{ _id: pid },
		product
	);
	if (!updatedProduct) {
		return next(new AppError("product not found", 404));
	}

	res.status(201).json({
		status: "success",
		product: updatedProduct
	});
});

module.exports.removeProduct = catchAsync(async (req, res) => {
	const { pid } = req.params;

	const product = await productService.deleteProduct({ _id: pid });
	if (!product) {
		return next(new AppError("product not found", 404));
	}

	res.status(201).json({
		status: "success",
		message: "product is deleted",
		product
	});
});
