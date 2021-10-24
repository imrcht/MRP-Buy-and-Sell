const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { protect, authorize } = require("../middleware/auth");

// public routes
router.get("/allproducts", productController.getAllProducts);
router.get("/productsByCategory", productController.getProductsByCategory);
router.get("/:productId", productController.getProductById);

// private routes
router.get("/listproduct", protect, productController.getProductForm);
router.post("/listproduct", protect, productController.postProduct);
router
	.route("/:productId")
	.put(protect, productController.updateProduct)
	.delete(protect, productController.deleteProduct);

module.exports = router;
