const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'quantity can not be less then 1'],
                deafult: 1
            }
        }
    ],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Cart', cartSchema);
