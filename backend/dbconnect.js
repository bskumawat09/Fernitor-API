const mongoose = require('mongoose');

const connectDB = (dbUrl) => {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log("Database connected");
    });
}

const disconnectDB = () => {
    mongoose.connection.close();
}

module.exports = { connectDB, disconnectDB };