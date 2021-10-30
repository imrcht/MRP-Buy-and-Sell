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
		html: `<head>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
		<title>Reset Password Email</title>
		<meta name="description" content="Reset Password Email Template.">
		<style type="text/css">
			a:hover {text-decoration: underline !important;}
		</style>
	</head>
	
	<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
		<div style="border: solid 2px black; height: auto; width: 700px;margin: auto;margin-top: 50px;>
		<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
			style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
			<tr>
				<td>
					<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
						align="center" cellpadding="0" cellspacing="0">
						<tr>
							<td style="height:80px;">&nbsp;</td>
						</tr>
						<tr>
							<td style="text-align:center;">
							  <a href="#mrp home page" title="logo" target="_blank">
								<img  src="img/logo1.jpeg" title="logo" alt="logo" style="height: 100px; width: 250px;">
							  </a>
							</td>
						</tr>
						<tr>
							<td style="height:20px;">&nbsp;</td>
						</tr>
						<tr>
							<td>
								<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
									style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
									<tr>
										<td style="height:40px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="padding:0 35px;">
											<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
												requested to reset your password</h1>
											<span
												style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
											<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
												We cannot simply send you your old password. A unique link to reset your
												password has been generated for you. To reset your password, click the
												following link.
											</p>
											<a href="${options.resetUrl}" 
												style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
												Password</a>
										</td>
									</tr>
									<tr>
										<td style="height:40px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						<tr>
							<td style="height:20px;">&nbsp;</td>
						</tr>
						<tr>
							<td style="height:80px;">&nbsp;</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		</div>
	</body>
	`,
	};

	const info = await transport.sendMail(mailOptions);
	console.log(`Message sent: ${info.message}`);
};

module.exports = sendEmail;
