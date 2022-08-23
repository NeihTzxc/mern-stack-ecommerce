const express = require('express');
const app = express();
const product = require('./routes/product.route');
const errorMiddleware = require('./middleware/error')
app.use(express.json());

app.use("/api/v1", product);
app.use(errorMiddleware)

module.exports = app