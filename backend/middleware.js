const jwt = require('jsonwebtoken');
const { productSchema } = require('./schema');

module.exports.isLoggedIn = (req, res, next) => {
    const secret = process.env.SECRET;
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, secret, function (err, decodedToken) {
            if (err) {
                console.log(err.message);
                res.json({ error: err.message });
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.json({ message: 'you must be logged in' });
    }
}

module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new Error(msg);
    } else {
        next();
    }
}