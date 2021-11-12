const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const authController = require("../controllers/auth");

// Public routes
router.get("/login", authController.getLogin);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);
router.post("/postotp", authController.postOtp);

router
	.route("/forgotpassword")
	.get(authController.getForgotPassword)
	.post(authController.postForgotPassword);
router
	.route("/resetpassword/:resetToken")
	.get(authController.getResetPassword)
	.post(authController.postResetPassword);

// Protected routes
router.get("/myproducts/:userId", protect, authController.getMyProducts);
router.get("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.route("/updateme").post(protect, authController.updateMe);
router
	.route("/updatemypassword")
	.get(protect, authController.getUpdateMyPassword)
	.post(protect, authController.updateMyPassword);

module.exports = router;
