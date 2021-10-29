const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const authController = require("../controllers/auth");

// Public routes
router.get("/login", authController.getLogin);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);
router
  .route("/forgotpassword")
  .get(authController.getForgotPassword)
  .post(authController.postForgotPassword);
router
  .route("/resetpassword/:resetToken")
  .get(authController.getResetPassword)
  .post(authController.postResetPassword);

// protected routes
router.get("/getUser", protect, authController.getUser);
router.post("/updateUser", protect, authController.updateUser);

// Protected routes
router.get("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);

module.exports = router;
