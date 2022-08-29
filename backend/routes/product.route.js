const express = require("express");
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReview } = require("../controllers/product.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route('/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAllProducts);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route('/product/:id').get(getProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews")
    .get(isAuthenticatedUser, getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);
module.exports = router