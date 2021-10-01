const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        name: String,
        email: {
            type: String,
            unique: [true, 'email already exist'],
            lowercase: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
            unique: [true, 'phone number already exist']
        },
        address: String,
        country: String,
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    },
    { timestamps: true }
);

// mongoose middleware
userSchema.pre('save', async function (next) {
    // runs only if the password is modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// mongoose static method 
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const isMatched = await bcrypt.compare(password, user.password);
        if (isMatched) {
            const { password, ...others } = user._doc;
            return others;
        }
        throw new Error('incorrect password');
    }
    throw new Error('incorrect email');
}

// query middleware
userSchema.pre(/^find/, function (next) {
    this.populate('cart');
    next();
});

module.exports = mongoose.model('User', userSchema);