const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { protect, authorize, authenticate } = require("../middleware/auth");
const Product = require("../models/Product");
const advanceResults = require("../middleware/advanceResults");

// public routes
router.get(
	"/allproducts",
	authenticate,
	advanceResults(Product),
	productController.getAllProducts,
);
router.get(
	"/productsByCategory",
	authenticate,
	productController.getProductsByCategory,
);

router.get(
	"/singleProduct/:productId",
	authenticate,
	productController.getProductById,
);

// private routes
router.get("/listproduct", protect, productController.getProductForm);
router.post("/listproduct", protect, productController.postProduct);

// Private routes
router.get(
	"/updateProduct/:productId",
	protect,
	productController.getUpdateForm,
);

router.post(
	"/updateProduct/:productId",
	protect,
	productController.updateProduct,
);

router.post(
	"/deleteProduct/:productId",
	protect,
	productController.deleteProduct,
);

router.post("/sendcontact/:no", protect, productController.sendMessageToSeller);

module.exports = router;
