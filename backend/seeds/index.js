const { products } = require('./products');
const Product = require('../models/product');
const { connectDB, disconnectDB } = require('../dbconnect');

connectDB();

const seedDB = async () => {
    await Product.deleteMany({});

    for (let i = 0; i < products.length; i++) {
        const product = new Product(products[i]);
        await product.save();
    }
}

seedDB().then(() => {
    disconnectDB();
});
