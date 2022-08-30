const ErrorHandle = require('../utils/errorhandle');
module.exports = (err, req, res, next) => {
    console.error(err);
    err.statusCode = err.statusCode | 500;
    err.message = err.message || "Internal Server Error";
    //Wrong Mongodb Id error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandle(message, 400);
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandle(message, 400);
    }
    //Wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHandle(message, 400);
    }
    //JWT EXPIRE error
    if (err.name === 'TokenExpiredError') {
        const message = 'Json Web Token is Expired, try again';
        err = new ErrorHandle(message,  400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}