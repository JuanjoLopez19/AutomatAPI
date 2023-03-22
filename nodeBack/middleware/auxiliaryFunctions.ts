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
	accessToken: string,
	username: string
) => {
	const options: mailOptions = {
		from: config.smtp.email,
		to: userEmail,
		subject: "AutomatAPI - Account activation",
		html:'<h1> Welcome to AutomatAPI!</h1></br>' + 
			username +', here is the link for activating your user account: <a href="' +
			config.host +
			config.activateRoute +
			"?token=" +
			accessToken +
			'">Activate account</a>.</br> <div>' +
			username +
			", if you cannot use previous link, please just acccess this url: <span> " +
			config.host +
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
