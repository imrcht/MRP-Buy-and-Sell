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
	res.status(200).render("product/product", {
		products: products,
	});
});

exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
	const category = req.query.category;
	const products = await Product.find({ category: category });
	res.status(200).render("product", {
		products: products,
	});
});

exports.getProductById = asyncHandler(async (req, res, next) => {
	const productId = req.params.productId;
	const product = await Product.findById(productId);
	if (!product) {
		res.render("error", {
			msg: "Resourse not found of given id",
			statuscode: 401,
		});
	} else {
		res.status(200).json({
			product,
		});
	}
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

exports.updateProduct = asyncHandler(async (req, res, next) => {
	// const updatedTitle = req.body.title;
	// const updatedCategory = req.body.category;
	// const updatedDescription = req.body.description;
	// const updatedDmage = req.file;
	// const updatedCost = req.body.cost;

	// const productId = req.param.productId;
	// const product = await Product.findById(productId);
	const product = await Product.findByIdAndUpdate(
		req.params.productId,
		req.body,
		{
			runValidators: true,
			new: true,
		},
	);

	if (!product) {
		return next(
			new errorResponse(
				`Resource not found of id ${req.params.productId}`,
				404,
			),
		);
	}

	res.status(200).render("product", {
		product,
	});
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
	const productId = req.param.productId;

	// before deleting we first need to delete the image from the system then we'll delete the product from database
	const product = await Product.findById(productId);
	const imagePath = product.imagePath;

	deleteFile(imagePath);

	await Product.deleteOne({ _id: productId });
});
