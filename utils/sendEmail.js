const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const secrets = require("../security");

const sendEmail = async (options) => {
	// create transport
	var transport = nodemailer.createTransport(
		sendgridTransport({
			auth: {
				api_key: secrets.sendgrid,
			},
		}),
	);

	var mailOptions = {
		from: `"Admin-MRP" <${secrets.from_email}>`,
		to: options.email,
		subject: "Password Reset",
		html: `<h1>Hello User</h1><p>Welcome to Our site MRP Sale.</p><p>Click on below link to reset your password</p><h2>${options.resetUrl}</h2>`,
	};

	const info = await transport.sendMail(mailOptions);
	console.log(`Message sent: ${info.message}`);
};

module.exports = sendEmail;
