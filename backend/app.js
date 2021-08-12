const express = require('express');
const path = require('path');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

const app = express();

/* app config */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Database config */
const { connectDB } = require('./dbconnect');
connectDB();

/* middlewares */
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products/:id/reviews', reviewRoutes);

/* API endpoints */
app.get('/api', (req, res) => {
    res.send('welcome to fernitor api');
});

app.all('*', (req, res, next) => {
    const err = new Error("page not found");
    err.status = 404;
    next(err);
});

// custom error handler
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "something went wrong";
    res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});