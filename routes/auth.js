const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const authController = require("../controllers/auth");

// Public routes
router.get("/login", authController.getLogin);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);

// Protected routes
router.get("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);

module.exports = router;
