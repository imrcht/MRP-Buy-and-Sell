const express = require("express");

const router = express.Router();

const footerController = require("../controllers/footer");

router.get("/company", footerController.getCompany);

router.get("/team", footerController.getTeam);

router.get("/contact", footerController.getContact);

module.exports = router;
