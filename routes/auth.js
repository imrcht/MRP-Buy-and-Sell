const express = require("express");
const router = express.Router();
const control = require("../controllers/auth");

router.post("/register", control.Postregister);
router.post("/login", control.Postlogin);

module.exports = router;
