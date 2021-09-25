const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name: {
            type: String,
            unique: [true, 'product with the same name already exist']
        },
        price: Number,
        image: {
            url: String,
            filename: String
        },
        color: {
            type: String,
            lowercase: true,
            default: null
        },
        category: {
            type: String,
            lowercase: true
        },
        quantity: Number,
        description: {
            type: String,
            default: null
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

// virtual populate
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
})

// mongoose query middleware, triggers when a product gets deleted, it deletes all reviews associated with product
productSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});

productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'seller',
        select: '-__v -password -createdAt -updatedAt',
        populate: { path: 'cart' }
    });
    next();
});

module.exports = mongoose.model('Product', productSchema);