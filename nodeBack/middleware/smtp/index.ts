import nodemailer from "nodemailer";
import config from "../../config/config";

export interface mailOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
}
const transporter = nodemailer.createTransport({
	host: config.smtp.host,
	port: config.smtp.port,
	auth: {
		user: config.smtp.email,
		pass: config.smtp.password,
	},
	tls: {
		// do not fail on invalid certs
		rejectUnauthorized: false,
	},
});

export const sendMail = function (mailOptions: mailOptions) {
	return new Promise((resolve, reject) => {
		try {
			transporter.verify(function (err, success) {
				if (err) {
					console.log("Error while verifying stmp connection: ", err);
					reject({ status: 500, message: err });
				} else {
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log("Error while sending email: ", error);
							reject({ status: 500, message: error });
						} else {
							resolve({ status: 200, message: "Email succesfully sended!" });
						}
					});
				}
			});
		} catch (err: any) {
			console.log("Email ERROR : " + err.code);
			reject({
				status: 500,
				message: "There was an error while sending email!",
			});
		}
	});
};
