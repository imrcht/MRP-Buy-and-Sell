const express = require("express");

const router = express.Router();

const productController = require("../controllers/product");

router.get("/product", productController.getProductForm);

router.post("/product", productController.postProduct);

router.get("/products", productController.getAllProducts);

router.get("/productsByCategory", productController.getProductsByCategory);

router.get("/product/:productId", productController.getProductById);

router.post("/updateProduct/:productId", productController.updateProduct);

router.delete("/deleteProduct/:productId", productController.deleteProduct);

module.exports = router;
