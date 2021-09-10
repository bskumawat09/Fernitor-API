const express = require('express');
const { validateUser, isLoggedIn, permit } = require('../middleware');
const userController = require('../controllers/users');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register',
    validateUser,
    authController.register
);

router.post('/login',
    authController.login
);

router.get('/logout',
    authController.logout
);

// get single user
router.get('/account',
    isLoggedIn,
    userController.getUser
);

// get cart associated with the user
router.get('/:id/cart',
    isLoggedIn,
    userController.getUserCart
);

// add product to cart
router.post('/cart/:pid',
    isLoggedIn,
    userController.addToCart
);

// get all the products associated with the user
router.get('/:id/products',
    isLoggedIn,
    permit('seller'),
    userController.getUserProducts
);

module.exports = router;
