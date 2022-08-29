const express = require("express");
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReview } = require("../controllers/product.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router.route('/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAllProducts)
router.route('/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)
router.route('/product/:id')
    .get(getProduct)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
module.exports = router