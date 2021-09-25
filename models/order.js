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
        bill: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);