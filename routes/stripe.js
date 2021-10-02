const AppError = require("../utils/appError");

const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res, next) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "inr",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                return next(new AppError(stripeErr, 500));
            }
            res.status(200).json({
                status: 'success',
                response: stripeRes
            });
        }
    );
});

module.exports = router;
