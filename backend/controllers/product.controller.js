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
//Create New Review or Update the review
exports.createProductReview = catchAsyncError(async(req, res, next) => {
    const {
        rating,
        comment,
        productId
    } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString())
    if(isReviewed) {
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()) (rev.rating = rating), (rev.comment = comment)
        })
    } else {
        product.review.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.ratings = product.reviews.forEach(rev => {
        avg += rev.rating
    }) / product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(201).json({
        success: true
    })
});
//Get All reviews of a product
exports.getProductReviews = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.id);
    if(!product) {
        return next(new ErrorHandle("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});
//Delete Reviews
exports.deleteReview = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.id);
    if(!product) {
        return next(new ErrorHandle("Product not found"));
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());
    let avg = 0;
    reviews.forEach(rev => avg += rev.rating);
    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
});