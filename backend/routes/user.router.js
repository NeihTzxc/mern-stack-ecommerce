const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logOut, forgotPassword, resetPassword } = require('../controllers/user.controller')
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
module.exports = router;