const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'quantity can not be less then 1']
                },
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);