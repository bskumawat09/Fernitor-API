const express = require('express');
const { isLoggedIn, permit, validateProduct } = require('../middleware');
const multer = require('multer');
const { multerStorage } = require('../cloudinary');
const productController = require('../controllers/products');

const router = express.Router();

const upload = multer({ storage: multerStorage });

// get all products
router.get('/',
    productController.getProducts
);

router.get('/shop/:category',
    productController.getProductsByCategory
);

// create new product
router.post('/',
    isLoggedIn,
    permit('admin'),
    upload.single('image'),
    validateProduct,
    productController.addNewProduct
);

// get single product
router.get('/:pid',
    productController.getSingleProduct
);

// edit product
router.put('/:pid',
    isLoggedIn,
    permit('admin'),
    upload.single('image'),
    productController.editProduct
);

// delete product
router.delete('/:pid',
    isLoggedIn,
    permit('admin'),
    productController.removeProduct
);

module.exports = router;
