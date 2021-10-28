const Product = require("../models/Product");

const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");

const fileDeleteHandler = require("../utils/removeImage");

exports.getProductForm = asyncHandler(async (req, res, next) => {
  // here in this we will render the product adding form page
  res.render("product/productForm");
});

exports.getUpdateForm = asyncHandler(async (req, res, next) => {
  // here in this we will render the updateProductForm for updating the product
  const productid = req.params.productId;

  const product = await Product.findById(productid);

  res.render("product/updateProductForm", {
    product: product,
  });
});

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render("product/product", {
    products: products,
  });
});

exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const category = req.query.category;
  const products = await Product.find({ category: category });
  res.status(200).render("product/product", {
    products: products,
  });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new errorResponse(`Resource not found of id ${productId}`, 404)
    );
  }
  res.status(200).render("product/singleProduct", {
    product: product,
  });
});

exports.postProduct = asyncHandler(async (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const image = req.file;
  const cost = req.body.cost;
  const description = req.body.description;

  const imageFileName = image.originalname;

  const product = new Product({
    title: title,
    category: category,
    imagePath: imageFileName,
    cost: cost,
    description: description,
  });

  const result = await product.save();

  if (result) {
    return res.redirect("/products/allproducts");
  }
});

exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;

  const updatedTitle = req.body.title;
  const updatedCategory = req.body.category;
  const updatedDescription = req.body.description;
  const updatedImage = req.file;
  const updatedCost = req.body.cost;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(
          new errorResponse(
            `Resource not found of id ${req.params.productId}`,
            404
          )
        );
      }

      product.title = updatedTitle;
      product.category = updatedCategory;
      product.description = updatedDescription;
      if (updatedImage) {
        const oldImagePath = product.imagePath;
        fileDeleteHandler.deleteFile("images/" + oldImagePath);

        const updatedImageName = updatedImage.originalname;
        product.imagePath = updatedImageName;
      }
      product.cost = updatedCost;

      return product.save();
    })
    .then((result) => {
      res.redirect("/products/allproducts");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  const imagePath = product.imagePath;

  console.log(product);

  // before deleting we first need to delete the image from the system then we'll delete the product from database
  fileDeleteHandler.deleteFile("images/" + imagePath);

  await Product.deleteOne({ _id: productId });

  await res.redirect("/products/allproducts");
});
