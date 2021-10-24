const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { protect, authorize } = require("../middleware/auth");

// public routes
router.get("/allproducts", productController.getAllProducts);
router.get("/productsByCategory", productController.getProductsByCategory);

// private routes
router.get("/listproduct", protect, productController.getProductForm);
router.post("/listproduct", protect, productController.postProduct);

// Public routes
router.get("/:productId", productController.getProductById);

// Private routes
router
	.route("/:productId")
	.put(protect, productController.updateProduct)
	.delete(protect, productController.deleteProduct);

module.exports = router;
