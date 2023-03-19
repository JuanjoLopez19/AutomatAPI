import db from "../database/database";
import User, { UserAttributes } from "../database/models/user";
import { Request, Response } from "express";
import config from "../config/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../middleware/auxiliaryFunctions";

export const Signup = (req: Request, res: Response) => {
	if (
		req.body.password != undefined &&
		req.body.username != undefined &&
		req.body.email != undefined &&
		req.body.role != undefined &&
		req.body.date != undefined &&
		req.body.firstName != undefined &&
		req.body.lastName != undefined
	) {
		let user: UserAttributes = {
			username: req.body.username,
			email: req.body.email,
			role: req.body.role,
			date: req.body.date,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: "",
			access_token: "",
			password_token: "",
		};

		bcrypt.genSalt(config.saltRounds, (err, salt) => {
			if (!err) {
				bcrypt.hash(req.body.password, salt, (err, passwordHashed) => {
					if (!err) {
						let userTokens = [];
						for (let i = 0; i < 2; i++) userTokens.push(generateToken(100));
						user.password = passwordHashed;
						user.access_token = userTokens[0];
						user.password_token = userTokens[1];

						User.create(user)
							.then((createdUser) => {
								if (createdUser) {
									const sessionObject = formatSessionObject(createdUser);
									if (
										sessionObject &&
										Object.keys(sessionObject).length !== 0 &&
										Object.getPrototypeOf(sessionObject) === Object.prototype
									) {
										const token = jwt.sign(
											{
												id: user.id,
												username: user.username,
												expiration: Date.now() + config.expiration,
											},
											config.secretKey
										);
										res
											.status(201)
											.cookie("jwt", token, { httpOnly: true, secure: false })
											.send({
												message: "User created successfully.",
												status: 201,
												data: sessionObject,
											});
									} else {
										return res
											.status(500)
											.send({ message: "Internal server error", status: 500 });
									}
								}
							})
							.catch((err) => {
								res.status(500).send({
									message:
										err.message ||
										"Some error occurred while creating the User.",
									status: 500,
								});
							});
					} else {
						res.status(500).send({
							message:
								err.message || "Some error occurred while creating the User.",
							status: 500,
						});
					}
				});
			} else {
				res.status(500).send({
					message:
						err.message || "Some error occurred while creating the User.",
					status: 500,
				});
			}
		});
	} else {
		res.status(400).send({ message: "Content can not be empty!", status: 400 });
	}
};

export const Signin = async (req: Request, res: Response) => {
	let user: User;
	if (!res.locals.user) {
		res.status(404).json({
			message: "user not found",
			status: 404,
		});
	}
	user = res.locals.user;
	// Posibility to add the user account activation
	let sessionObject = formatSessionObject(user);
	let token = jwt.sign(
		{
			id: user.id,
			username: user.username,
			expiration: Date.now() + config.expiration,
		},
		config.secretKey
	);
	if (
		sessionObject &&
		Object.keys(sessionObject).length !== 0 &&
		Object.getPrototypeOf(sessionObject) === Object.prototype
	) {
		return res
			.cookie("jwt", token, { httpOnly: true, secure: false })
			.status(200)
			.send({ data: sessionObject, status: 200, message: "User logged in" });
	} else {
		return res
			.status(500)
			.send({ message: "Internal server error", status: 500 });
	}
};

export const Signout = (req: Request, res: Response) => {
	if (req.cookies.jwt) {
		res
			.clearCookie("jwt")
			.status(200)
			.send({ message: "User logged out", status: 200 });
	} else {
		res.status(400).send({ message: "Invalid JWT", status: 400 });
	}
};

const formatSessionObject = (user: User | null) => {
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
				date: user.date,
			};
		} catch (err) {
			console.log("Error on formatting the session Object", err);
		}
	}
	return sessionObject;
};
