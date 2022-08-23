const Product  = require('../models/product.model');

//Create Product
exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })
}
//Get All Products
exports.getAllProducts = async (req, res) => {
    const products = await Product.find({
        deleted_flg: false
    });
    res.status(200).json({
        success: true,
        products
    })
}
//Get Product
exports.getProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }
    res.status(200).json({
        success: true,
        product
    })
}
//Update Product
exports.updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
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
}
//Delete Product
exports.deleteProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, {
        deleted_flg: true
    });
    res.status(200).json({
        success: true,
        message: "Product Delete Successfully"
    })
}