const Product = require("../models/Product");
const errorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/async");
const fileDeleteHandler = require("../utils/removeImage");
const User = require("../models/User");
const sendSms = require("../utils/sendSms");
const sendEmail = require("../utils/sendEmail");

// @desc 	get product form
// @route   GET products/listproduct
// @access	Private
exports.getProductForm = asyncHandler(async (req, res, next) => {
	// here in this we will render the product adding form page
	res.render("product/productForm");
});

// @desc 	  update product
// @route   PUT products/updateproduct/:productId
// @access	Private
exports.getUpdateForm = asyncHandler(async (req, res, next) => {
	// here in this we will render the updateProductForm for updating the product
	const productid = req.params.productId;

	const product = await Product.findById(productid);

	res.render("product/updateProductForm", {
		product: product,
	});
});

// @desc 	get all products
// @route   GET products/allproducts
// @access	Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
	// const products = await Product.find();
	let name = undefined;
	if (req.user) {
		name = req.user.name;
	}
	res.status(200).render("product/product", {
		products: res.advanceResult.data,
		name,
	});
});

// @desc 	get products by category
// @route   GET products/productsbyCategory
// @access	Public
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
	let name = undefined;
	if (req.user) {
		name = req.user;
	}
	const category = req.query.category;
	const products = await Product.find({ category: category });
	res.status(200).render("product/product", {
		products: products,
		name,
	});
});

// @desc 	Get single product
// @route   GET products/singleProduct/:productId
// @access	Public
exports.getProductById = asyncHandler(async (req, res, next) => {
	const productId = req.params.productId;
	const product = await Product.findById(productId);
	let name = undefined;
	if (req.user) {
		name = req.user.name;
	}
	if (!product) {
		return next(
			new errorResponse(`Resource not found of id ${productId}`, 404),
		);
	}
	res.status(200).render("product/singleProduct", {
		product: product,
		name,
	});
});

// @desc 	List a product
// @route   POST products/listproduct
// @access	Private
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
		seller: req.user._id,
	});

	const result = await product.save();

	//  Adding product to user
	let user = await User.findById(req.user.id);

	let addproducts = user.listedProducts;
	addproducts.push(product._id);

	user = await User.findByIdAndUpdate(
		req.user.id,
		{ listedProducts: addproducts },
		{
			runValidators: true,
			new: true,
		},
	);

	const allusers = User.find();
	const maillist = [];
	(await allusers).forEach((singleuser) => {
		maillist.push(singleuser.email);
	});
	if (result) {
		productUrl = `${req.protocol}://${req.get(
			"host",
		)}/products/singleProduct/${product._id}`;
		const options = {
			heading: "New Product Listed",
			mainmessage: `${user.name} has listed new product named ${title}, Have a look at this`,
			Url: productUrl,
			buttonMessage: "Click here to view",
			email: maillist,
			subject: "NEW PRODUCT LISTED",
		};
		sendEmail(options);
		return res.redirect("/products/allproducts");
	}
});

// @desc 	  Update product
// @route   PUT products/updateProduct/:productId
// @access	Private
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
				return res.status(404).render("error", {
					msg: `Resource not found of id ${req.params.productId}`,
					statuscode: 404,
				});
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

// @desc 	  Delete product
// @route   DELETE products/deleteProduct/:productId
// @access	Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
	const productId = req.params.productId;

	const product = await Product.findById(productId);
	const imagePath = product.imagePath;

	if (
		product.seller.toString() === req.user._id.toString() ||
		req.user.role === "admin"
	) {
		// before deleting we first need to delete the image from the system then we'll delete the product from database
		fileDeleteHandler.deleteFile("images/" + imagePath);

		await Product.deleteOne({ _id: productId });

		await res.redirect("/products/allproducts");
	} else {
		return res.status(401).render("error", {
			msg: "YOu only have the access of products listed buy you",
			statuscode: 401,
		});
	}
});

exports.sendMessageToSeller = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.no);
	const smsoptions = {
		message: `${req.user.name} has shown interest in the product you listed on MRP. Contact buyer to proceed further. His contact number is ${req.user.phone}`,
		number: user.phone,
	};
	const smsResult = sendSms(smsoptions);
	// res.redirect("/products/allproducts");
	res.render("success", {
		msg: "we have informed the seller about your intrest, seller will contact you shortly ",
	});
});
