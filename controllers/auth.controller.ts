import db from "../database/database";
import User, { UserAttributes } from "../database/models/user";
import { Request, Response } from "express";
import config from "../config/config";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../middleware/auxiliaryFunctions";

export const Signup = (req: Request, res: Response) => {
	if (
		req.body.password != undefined &&
		req.body.username != undefined &&
		req.body.email != undefined &&
		req.body.role != undefined &&
		req.body.date != undefined
	) {
		let user: UserAttributes = {
			username: req.body.username,
			email: req.body.email,
			role: req.body.role,
			date: req.body.date,
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
								res.status(201).send({
									message: "User created successfully.",
								});
							})
							.catch((err) => {
								res.status(500).send({
									message:
										err.message ||
										"Some error occurred while creating the User.",
								});
							});
					} else {
						res.status(500).send({
							message:
								err.message || "Some error occurred while creating the User.",
						});
					}
				});
			} else {
				res.status(500).send({
					message:
						err.message || "Some error occurred while creating the User.",
				});
			}
		});
	} else {
		res.status(400).send({ message: "Content can not be empty!" });
	}
};

export const Signin = async (req: Request, res: Response) => {
	if (req.body.username != undefined && req.body.password != undefined) {
		try {
			let user: User | null = await User.findOne({
				where: {
					username: req.body.username,
				},
			});
			if (!user) {
				res.status(404).send({ message: "User Not found." });
			}
			let passwordIsValid = bcrypt.compareSync(
				req.body.password,
				// @ts-ignore: Object is possibly 'null'.
				user.password || ""
			);
			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Invalid Password!",
				});
			}
			// Posibility to add the user account activation
			let sessionObject = formatSessionObject(user);
			if (
				sessionObject &&
				Object.keys(sessionObject).length !== 0 &&
				Object.getPrototypeOf(sessionObject) === Object.prototype
			) {
				return res.status(200).send(sessionObject);
			} else {
				return res.status(500).send({ message: "Internal server error" });
			}
		} catch (err) {
			console.log("error: ", err);
			return res.status(500).send({ message: "Internal server error" });
		}
	} else {
		res.status(400).send({ message: "Bad Request" });
	}
};

const formatSessionObject = (user: User | null) => {
	let sessionObject = {};
	if (user) {
		try {
			let token = jwt.sign({ id: user.id }, config.secretKey, {});
			sessionObject = {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
				date: user.date,
				access_token: token,
			};
		} catch (err) {
			console.log("Error on formatting the session Object", err);
		}
	}
	return sessionObject;
};
