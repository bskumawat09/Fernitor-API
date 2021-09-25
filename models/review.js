const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    description: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'name email -cart'
    });
    next();
});

module.exports = mongoose.model('Review', reviewSchema);