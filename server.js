const path = require("path");
const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const hpp = require("hpp");
// home controller
const homecontroller = require("./controllers/home");
// auth routes
const authRoutes = require("./routes/auth");
// product routes
const productRoutes = require("./routes/product");
// admin routes
const adminRoutes = require("./routes/admin");
// Error middlerware
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 7000;

// connect to database
connectDB();

app.set("view engine", "ejs");

// Storing file
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

// filtering file
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jfif"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// Body parser and cookiew parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

// Set Security headers
app.use(helmet());

// prevent xss attacks
app.use(xss());

// sanitize everything Protext from noSQL injection
app.use(mongoSanitize());

// Rate limit 100 requests per 10 minutes
const limiter = expressRateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// prevent http params pollution attack
app.use(hpp());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);

// Home Route
app.get("/", homecontroller.getAuth);

// mount routes
app.use("/users", authRoutes);
app.use("/products", productRoutes);
app.use("/admincontrol", adminRoutes);
app.use("*", (req, res, next) => {
	res.status(404).render("error", {
		msg: "Page not Found",
		statuscode: 404,
	});
});

// Using Middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});

// Handle Unhadled Promise rejections
process.on("unhandledRejection", (err, Promise) => {
	console.log(`Error: ${err}`);
	// Close server and exit with 1
	server.close(() => process.exit(1));
});
