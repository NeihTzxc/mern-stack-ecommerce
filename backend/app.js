const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const product = require('./routes/product.route');
const user = require('./routes/user.router')
const order = require('./routes/order.route')
const errorMiddleware = require('./middleware/error');
app.use(express.json());
app.use(cookieParser())

//Route Imports
app.use("/api/v1", product);
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use(errorMiddleware)

module.exports = app