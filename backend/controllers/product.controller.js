const Product = require('../models/product.model');
const ErrorHandle = require('../utils/errorhandle');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures')
//Create Product
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    console.log("BODY: ", req.body)
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })
});
//Get All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 2;
    const productCount = await Product.countDocuments();
    console.log("productCount: ", productCount);
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products
    })
});
//Get Product
exports.getProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandle("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
});
//Update Product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandle("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    })
});
//Delete Product
exports.deleteProduct = catchAsyncError(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandle("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, {
        deleted_flg: true
    });
    res.status(200).json({
        success: true,
        message: "Product Delete Successfully"
    })
});