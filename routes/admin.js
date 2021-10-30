const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const admincontroller = require("../controllers/admin");
const advanceResults = require("../middleware/advanceResults");
const User = require("../models/User");

router.get(
	"/allusers",
	protect,
	authorize("admin"),
	advanceResults(User),
	admincontroller.getUsers,
);
router
	.route("/:id")
	.put(protect, authorize("admin"), admincontroller.update)
	.get(protect, authorize("admin"), admincontroller.getUser);
router.post("/user", protect, authorize("admin"), admincontroller.createUser);

module.exports = router;
