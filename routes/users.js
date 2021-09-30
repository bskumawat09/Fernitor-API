const express = require('express');
const { validateUser, isLoggedIn, isAuthor, permit } = require('../middleware');
const userController = require('../controllers/users');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register',
    validateUser,
    authController.register
);

router.post('/registerSeller',
    validateUser,
    authController.registerSeller
);

router.post('/login',
    authController.login
);

router.get('/logout',
    authController.logout
);

// get cart associated with the user
router.get('/cart',
    isLoggedIn,
    permit('user'),
    userController.getUserCart
);

// add product to cart
router.post('/cart/:pid',
    isLoggedIn,
    permit('user'),
    userController.addToCart
);

// remove product from cart
router.delete('/cart/:pid',
    isLoggedIn,
    permit('user'),
    userController.removeFromCart
);

// get all the products associated with the user
router.get('/:id/products',
    isLoggedIn,
    permit('seller', 'admin'),
    userController.getUserProducts
);

// get single user
router.get('/:id',
    isLoggedIn,
    isAuthor,
    userController.getUser
);

module.exports = router;
