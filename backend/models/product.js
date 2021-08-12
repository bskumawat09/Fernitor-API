const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    category: String,
    quantity: Number,
    description: {
        type: String,
        default: null
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

// mongoose middleware, triggers when a product gets deleted, it deletes all reviews associated with product
productSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});

module.exports = mongoose.model('Product', productSchema);