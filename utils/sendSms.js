const fast2sms = require("fast-two-sms");
// const secrets = require("../security");
require('dotenv').config();

const sendSms = async (options) => {
	var smsOptions = {
		authorization: process.env.fast2sms,
		message: options.message,
		numbers: [options.number],
	};
	const info = await fast2sms.sendMessage(smsOptions); //Asynchronous Function.
	console.log(info.message);
	return info.return;
};

module.exports = sendSms;
