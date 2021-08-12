const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    phone: String,
    address: String,
    country: String,
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);