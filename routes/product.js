const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { protect, authorize } = require("../middleware/auth");

// public routes
router.get("/allproducts", productController.getAllProducts);
router.get("/productsByCategory", productController.getProductsByCategory);

router.get("/singleProduct/:productId", productController.getProductById);

// private routes
router.get("/listproduct", protect, productController.getProductForm);
router.post("/listproduct", protect, productController.postProduct);

// Private routes
router.get(
  "/updateProduct/:productId",
  protect,
  productController.getUpdateForm
);

router.post(
  "/updateProduct/:productId",
  protect,
  productController.updateProduct
);

router.post(
  "/deleteProduct/:productId",
  protect,
  productController.deleteProduct
);

module.exports = router;
