const express = require("express");

const app = express();
const PORT = process.env.PORT || 7000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res, next) => {
	res.render("index");
});

app.listen(PORT, () => {
	console.log("App listening on port 7000!");
});
