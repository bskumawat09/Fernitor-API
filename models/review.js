const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        rating: Number,
        description: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    },
    { timestamps: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'name email -cart'
    });
    next();
});

module.exports = mongoose.model('Review', reviewSchema);