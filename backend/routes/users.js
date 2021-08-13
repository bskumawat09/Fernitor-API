const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, address, country } = req.body.user;
        const newUser = new User({ name, email, phone, address, country });
        await newUser.save();
        res.json({
            message: "registered successfully",
            user: newUser
        });
    } catch (e) {
        res.json({ message: e });
    }
})

router.post('/login', (req, res) => {
    res.json({ message: "logged in" });
})

router.get('/logout', (req, res) => {
    res.json({ message: "logged out" });
})

// get single user (tested)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('cart');
        res.json({ user: user });
    } catch (e) {
        res.json({ message: e });
    }
})

// get cart associated with the user (tested)
router.get('/:id/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('cart');
        res.json({ cart: user.cart });
    } catch (e) {
        res.json({ message: e });
    }
})

module.exports = router;
