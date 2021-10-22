const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/register", authController.getRegister);

router.post("/register", authController.postRegister);

router.route("/:id").get(protect, authorize("admin"), authController.getUser);

module.exports = router;
