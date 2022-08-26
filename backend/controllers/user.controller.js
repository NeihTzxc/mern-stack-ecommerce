const ErrorHandle = require('../utils/errorhandle');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const User = require('../models/user.model');
const userLogin = require('../models/userLogin.model')
const { getDeviceFromHeasers, makeID } = require('../utils/helper');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
//Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {
        name,
        email,
        password
    } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "profile "
        }
    });
    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success: true,
    //     token
    // })
    sendToken(user, 201, res);
})
//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    const headers = req.headers;
    //checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandle("Please Enter Email&Password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandle("Invalid email or password", 401));
    }
    const isPasswordMatched = user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(ErrorHandle("Invalid email or password", 401))
    }
    //Update time user and device user login
    await userLogin.findOneAndUpdate({
        user_id: user._id
    }, {
        device_id: '', // add device later default empty
        login_time: new Date()
    }, {
        new: true,
        upsert: true
    });
    sendToken(user, 200, res);
})

//Logout User
exports.logOut = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})
//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandle("User not found", 404))
    }
    //Get reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset  token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordToken = undefined;
        await User.save({ validateBeforeSave: false });
        return next(new ErrorHandle(error.message, 500));
    }
})

//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorHandle("Reset password token is invalid or has  been expired", 404));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandle("Password does not password", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
})

//GetUserDetail
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

//Update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandle("Old password is incorrect", 400));
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandle("Password does not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

//Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    //We will add cloudinary later
    const user = await User.findOneAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true
    })
})
//Get All Users (admin)
exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find({
        deleted_flg: false
    });
    res.status(200).json({
        success: true,
        users
    })
})
//Get Single User (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ErrorHandle(`User does not exists with Id: ${req.params.id}`)
        )
    }
    return res.status(200).json({
        success: true,
        user
    })
})
//Update User Role (admin)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findOneAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
    })
})
//Delete User (admin)
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }
    // format data for user deleted is
    // {
    //     "email": `${timestamp}-${random_number}-${email}`
    // }
    const dataDeletedUser = {
        email: `${Date.now()}-${makeID(8)}-${user.email}`,
        deleted_flg: true
    }
    // await User.findOneAndUpdate(req.params.id, dataDeletedUser, {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false
    // })
    res.status(200).json({
        success: true
    })
})