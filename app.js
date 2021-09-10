if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const cookieParser = require('cookie-parser');
const Cors = require('cors');
const jwt = require('jsonwebtoken');

const { connectDB } = require('./dbconnect');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errors');
const { authenticate } = require('./middleware');

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

// middleware for setting req.user
app.use(authenticate);

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products/:id/reviews', reviewRoutes);

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