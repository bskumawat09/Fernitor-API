const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../middleware');

const router = express.Router();

const createToken = (id) => {
    const secret = process.env.SECRET;
    return jwt.sign({ id }, secret, { expiresIn: 24 * 60 * 60 });
}

router.post('/register', validateUser, async (req, res) => {
    try {
        const { user } = req.body;
        const newUser = new User(user);
        await newUser.save();

        await User.login(user.email, user.password);

        const token = createToken(newUser._id);
        res.cookie('jwt', token, { httpOnly: true });

        res.status(201).json({
            message: "registered successfully",
            user: newUser
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body.user;
        const user = await User.login(email, password);

        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true });

        res.status(200).json({
            message: 'login successful',
            user: user._id
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
})

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.json({ message: "logged out" });
})

// get single user (tested)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('cart');
        res.json({ user: user });
    } catch (e) {
        res.json({ error: e.message });
    }
})

// get cart associated with the user (tested)
router.get('/:id/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('cart');
        res.json({ cart: user.cart });
    } catch (e) {
        res.json({ error: e });
    }
})

module.exports = router;
