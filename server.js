const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 7000;

// connect to database
connectDB();

app.set("view engine", "ejs");
// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// just for testing
app.get('/',(req, res, next)=>{
	res.render('Home_page.ejs');
})
app.get('/login',(req, res,next)=>{
	res.render('login.ejs');
})
app.get('/register',(req, res, next)=>{
	res.render('user_reg.ejs');
})
app.get('/product',(req, res, next)=>{
	res.render('product.ejs');
})
app.get('/sign',(req, res, next)=>{
	res.render('sign.ejs');
})

const server = app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

// Handle Unhadled Promise rejections
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error: ${err}`);
  // Close server and exit with 1
  server.close(() => process.exit(1));
});
