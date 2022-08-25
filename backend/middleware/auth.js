const ErrorHandle = require('../utils/errorhandle');
const catchAsyncError = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];;
    if (!token) {
        return next(new ErrorHandle("Please login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
})
exports.authorizeRoles = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(
                new ErrorHandle(`Role ${req.user.role} is not allowed to access this resource`, 403)
            )
        }
        next();
    }
}