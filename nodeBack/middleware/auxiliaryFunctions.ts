import { mailOptions, sendMail } from "./smtp";
import config from "../config/config";
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

export const sendActivationEmail = async (
	userEmail: string,
	accessToken: string
) => {
	const options: mailOptions = {
		from: config.smtp.email,
		to: userEmail,
		subject: "AutomatAPI - Account activation",
		html:
			'Welcome to AutomatAPI! Here is the link for activating your user account: <a href="' +
			config.host +
			config.activateRoute +
			"?token=" +
			accessToken +
			'">Activate account</a>. If you cannot use previous link, please just acccess this url ' +
			config.host +
			config.activateRoute +
			"?token=" +
			accessToken,
	};

	const emailResponse: any = await sendMail(options);
	if (emailResponse.status === 200) {
		return 200;
	}else
		return 500;
};
