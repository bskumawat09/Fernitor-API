if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const cookieParser = require('cookie-parser');
const Cors = require('cors');

const { connectDB } = require('./dbconnect');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const orderRoutes = require('./routes/orders');
const stripeRoutes = require('./routes/stripe');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errors');

const app = express();

/* app config */
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));

/* Database config */
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/fernitor';
connectDB(dbUrl);

/* middlewares */
app.use(express.json());
app.use(cookieParser());
app.use(Cors());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', stripeRoutes);

/* API endpoints */
app.get('/api', (req, res) => {
    res.send('<h2> welcome to fernitor api </h2>');
});

app.all('*', (req, res, next) => {
    const err = new AppError("page not found", 404);
    next(err);
});

// custom error handler
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});