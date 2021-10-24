const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const authController = require("../controllers/auth");

// Public routes
router.get("/login", authController.getLogin);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);

// Protected routes
router.get("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);

// Admin routes
router.get("/allusers", protect, authorize("admin"), authController.getUsers);
router
	.route("/:id")
	.put(protect, authorize("admin"), authController.update)
	.get(protect, authorize("admin"), authController.getUser);
router.post("/user", protect, authorize("admin"), authController.createUser);

module.exports = router;
