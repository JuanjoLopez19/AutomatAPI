import { mailOptions, sendMail } from "./smtp";
import AWS from "aws-sdk";
import config from "../config/config";
import * as crypto from "crypto";
import User from "../database/models/user";
import { activateAccountTemplate } from "../emails_templates/activate_account";
import { remPwdTemplate } from "../emails_templates/forget_pwd";

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
		html: activateAccountTemplate(username, accessToken),
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
		html: remPwdTemplate(username, passwordToken),
	};

	const emailResponse: any = await sendMail(options);
	if (emailResponse.status === 200) {
		return 200;
	} else return 500;
};

const iv = Buffer.from(config.cypher.iv, "hex");
const key = crypto.scryptSync(config.cypher.key, "salt", 32);

export const encryptData = (data: string) => {
	const cipher = crypto.createCipheriv(config.cypher.algorithm, key, iv);

	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");

	return encrypted;
};

export const decryptData = (data: string) => {
	const decipher = crypto.createDecipheriv(config.cypher.algorithm, key, iv);

	let decrypted = decipher.update(data, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
};

export const deleteItemsAWS = (certs: string[], template: string) => {
	AWS.config.update({
		accessKeyId: config.aws.accessKey,
		secretAccessKey: config.aws.secretKey,
		region: config.aws.region,
	});

	const s3 = new AWS.S3();
	certs.forEach((cert) => {
		if (cert !== "") {
			const decrypt = decryptData(cert);
			const params = {
				Bucket: config.aws.bucket,
				Key: decrypt,
			};
			s3.deleteObject(params, function (err, data) {
				if (err) console.log(err, err.stack);
				// an error occurred
				else console.log(data); // successful response
			});
		}
	});

	const params = {
		Bucket: config.aws.bucket,
		Key: `templates/${decryptData(template)}`,
	};
	s3.deleteObject(params, function (err, data) {
		if (err) console.log(err, err.stack);
		// an error occurred
		else console.log(data); // successful response
	});
};

export const deleteItem = (key: string, type: string | null = null) => {
	AWS.config.update({
		accessKeyId: config.aws.accessKey,
		secretAccessKey: config.aws.secretKey,
		region: config.aws.region,
	});

	const s3 = new AWS.S3();
	let params: AWS.S3.DeleteObjectRequest;
	if (type) {
		params = {
			Bucket: config.aws.bucket,
			Key: `${type}/${decryptData(key)}`,
		};
	} else {
		params = {
			Bucket: config.aws.bucket,
			Key: decryptData(key),
		};
	}

	s3.deleteObject(params, function (err, data) {
		if (err) console.log("Error", err, err.stack);
		// an error occurred
		else console.log("Success", data); // successful response
	});
};

export const formatSessionObject = (user: User | null) => {
	let sessionObject = {};
	if (user) {
		try {
			sessionObject = {
				id: user.id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
				date: user.create_date,
				birthdate: user.birthDate,
				image: user.image,
				template_count: user.template_count,
			};
		} catch (err) {
			console.log("Error on formatting the session Object", err);
		}
	}
	return sessionObject;
};
