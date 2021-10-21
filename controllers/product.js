const Product = require("../models/Product");

const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");

const deleteFile = require("../utils/removeImage");

exports.getProductForm = asyncHandler(async (req, res, next) => {
  // here in this we will render the product adding form page
  res.render("product/productForm");
});

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
});

exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const category = req.query.category;
  const productsByCategory = await Product.find({ category: category });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const productId = req.param.productId;
  const product = await Product.findById(productId);
});

exports.postProduct = asyncHandler(async (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const description = req.body.description;
  const image = req.file;
  const cost = req.body.cost;
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedCategory = req.body.category;
  const updatedDescription = req.body.description;
  const updatedDmage = req.file;
  const updatedCost = req.body.cost;

  const productId = req.param.productId;
  const product = await Product.findById(productId);
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.param.productId;

  // before deleting we first need to delete the image from the system then we'll delete the product from database
  const product = await Product.findById(productId);
  const imagePath = product.imagePath;

  deleteFile(imagePath);

  await Product.deleteOne({ _id: productId });
});
