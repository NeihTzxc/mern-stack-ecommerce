const express = require("express");
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const router = express.Router();
router.route('/products').get(getAllProducts)
router.route('/product/new').post(createProduct)
router.route('/product/:id').get(getProduct).put(updateProduct).delete(deleteProduct)
module.exports = router