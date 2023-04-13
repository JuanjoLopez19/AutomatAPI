import { mailOptions, sendMail } from "./smtp";
import config from "../config/config";
import * as crypto from "crypto";

const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);
const key = crypto.scryptSync(config.secretKey, "salt", 32);
// Access and password token generator
export const generateToken = (length: number) => {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

// Send activation email
export const sendActivationEmail = async (
	userEmail: string,
	accessToken: string,
	username: string
) => {
	const options: mailOptions = {
		from: config.smtp.email,
		to: userEmail,
		subject: "AutomatAPI - Account activation",
		html:
			"<h1> Welcome to AutomatAPI!</h1></br>" +
			username +
			', here is the link for activating your user account: <a href="' +
			config.front +
			config.activateRoute +
			"?token=" +
			accessToken +
			'">Activate account</a>.</br> <div>' +
			username +
			", if you cannot use previous link, please just acccess this url: <span> " +
			config.front +
			config.activateRoute +
			"?token=" +
			accessToken +
			"</span></div>",
	};

	const emailResponse: any = await sendMail(options);
	if (emailResponse.status === 200) {
		return 200;
	} else return 500;
};

// Send password reset email
export const sendPasswordResetEmail = async (
	userEmail: string,
	passwordToken: string,
	username: string
) => {
	const options: mailOptions = {
		from: config.smtp.email,
		to: userEmail,
		subject: "AutomatAPI - Password reset",
		html:
			"<h1> Hello again, " +
			username +
			'!</h1></br> We are sorry to hear you have forgotten your password, to reset it click here: <a href="' +
			config.front +
			config.resetRoute +
			"?token=" +
			passwordToken +
			'">Reset password</a>.</br> <div>' +
			username +
			", if you cannot use previous link, please just acccess this url: <span> " +
			config.front +
			config.resetRoute +
			"?token=" +
			passwordToken +
			"</span></div>",
	};

	const emailResponse: any = await sendMail(options);
	if (emailResponse.status === 200) {
		return 200;
	} else return 500;
};

export const encryptData = (data: string) => {
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");

	console.log("Encrypted: " + encrypted);
	return encrypted;
};

export const decryptData = (data: string) => {
	const decipher = crypto.createDecipheriv(algorithm, key, iv);

	let decrypted = decipher.update(data, "hex", "utf8");
	decrypted += decipher.final("utf8");

	console.log("Decrypted: " + decrypted);
	return decrypted;
};
