const express = require('express');
const authController = require('../controllers/auth');
const { validateUser, isLoggedIn } = require('../middleware');
const router = express.Router();

router.post('/register',
    validateUser,
    authController.register
);

router.post('/register-admin',
    authController.registerAdmin
);

router.post('/login',
    authController.login
);

router.get('/logout',
    isLoggedIn,
    authController.logout
);

module.exports = router;
