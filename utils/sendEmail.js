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
		from: `${secrets.from_name} <${secrets.from_email}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	const info = await transport.sendMail(mailOptions);
	console.log(info);
	console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
