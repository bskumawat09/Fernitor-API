const express = require('express');
const { isLoggedIn, validateProduct } = require('../middleware');
const multer = require('multer');
const { multerStorage } = require('../cloudinary');
const productController = require('../controllers/products');

const router = express.Router();

const upload = multer({ storage: multerStorage });

// get all products
router.get('/',
    productController.getProducts
);

// create new product
router.post('/',
    isLoggedIn,
    upload.single('image'),
    validateProduct,
    productController.addNewProduct
);

// get single product
router.get('/:id',
    productController.getSingleProduct
);

// edit product
router.put('/:id',
    isLoggedIn,
    upload.single('image'),
    productController.editProduct
);

// delete product
router.delete('/:id',
    isLoggedIn,
    productController.removeProduct
);

module.exports = router;
