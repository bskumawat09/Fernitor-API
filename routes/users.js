const express = require('express');
const { validateUser, isLoggedIn, isAuthor, permit } = require('../middleware');
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
    isLoggedIn,
    authController.logout
);

// get all users
router.get('/',
    isLoggedIn,
    permit('admin'),
    userController.getUsers
);

// get user's cart
router.get('/:uid/cart',
    isLoggedIn,
    isAuthor,
    permit('user'),
    userController.getUserCart
);

// add product to cart
router.post('/:uid/cart/:pid',
    isLoggedIn,
    isAuthor,
    permit('user'),
    userController.addToCart
);

// remove product from cart
router.delete('/:uid/cart/:pid',
    isLoggedIn,
    isAuthor,
    permit('user'),
    userController.removeFromCart
);

// get a user
router.get('/:uid',
    isLoggedIn,
    isAuthor,
    userController.getUser
);

// update user
router.put('/:uid',
    isLoggedIn,
    isAuthor,
    permit('user'),
    userController.updateUser
);

module.exports = router;
