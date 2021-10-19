const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const auth = require("./routes/auth");

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

app.use("/users", auth);

const server = app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

// Handle Unhadled Promise rejections
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error: ${err}`);
  // Close server and exit with 1
  server.close(() => process.exit(1));
});
