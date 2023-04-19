import { Request, Response } from "express";
import User from "../database/models/user";
import config from "../config/config";
import axios from "axios";
import Templates, { Tokens } from "../database/models/templates";
import { WhereOptions } from "sequelize";
import { deleteItemsAWS } from "../middleware/auxiliaryFunctions";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
	if (req.user) {
		const users = await User.findAll({
			attributes: { exclude: ["password", "password_token"] },
		});
		res.status(200).json({ data: users, message: "Users found", status: 200 });
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	if (req.body.user_id !== undefined) {
		User.findByPk(req.body.user_id).then((user) => {
			if (user == null) {
				res.status(404).json({ message: "User not found", status: 404 });
				return;
			}
			Templates.findAll({
				where: { user_id: user.id } as WhereOptions<Templates>,
			})
				.then(async (templates) => {
					if (templates.length === 0) {
						user
							.destroy()
							.then(() => {
								res.status(200).json({ message: "User deleted", status: 200 });
								return;
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({ message: "Internal Server Error" });
								return;
							});
					} else {
						try {
							await Promise.all(
								templates.map(async (template) => {
									const token = await Tokens.findOne({
										where: { template_id: template.id },
									});
									if (token) {
										deleteItemsAWS(
											[token.cert_key || "", token.private_key || ""],
											token.template_token
										);
										await token.destroy();
									}
								})
							);

							const response = await axios.delete(
								`${config.python.host}:${config.python.port}/users/${user.id}/delete`
							);
							res.status(response.status).json({
								status: response.status,
								message: response.data.message,
							});
						} catch (err) {
							console.log(err);
							res.status(500).json({ message: "Internal Server Error" });
						}
					}
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({ message: "Internal Server Error" });
					return;
				});
		});
	} else {
		res.status(400).json({ message: "Bad Request", status: 400 });
	}
};

export const deleteAccount = async (req: Request, res: Response) => {
	//@ts-ignore
	const user_id = await jwt.decode(req.cookies["jwt"]).id;
	User.findByPk(user_id).then((user) => {
		if (user == null) {
			res.status(404).json({ message: "User not found", status: 404 });
			return;
		}
		Templates.findAll({
			where: { user_id: user.id } as WhereOptions<Templates>,
		})
			.then(async (templates) => {
				if (templates.length === 0) {
					user
						.destroy()
						.then(() => {
							res.status(200).json({ message: "User deleted", status: 200 });
							return;
						})
						.catch((err) => {
							console.log(err);
							res.status(500).json({ message: "Internal Server Error" });
							return;
						});
				} else {
					try {
						await Promise.all(
							templates.map(async (template) => {
								const token = await Tokens.findOne({
									where: { template_id: template.id },
								});
								if (token) {
									deleteItemsAWS(
										[token.cert_key || "", token.private_key || ""],
										token.template_token
									);
									await token.destroy();
								}
							})
						);

						const response = await axios.delete(
							`${config.python.host}:${config.python.port}/users/${user.id}/delete`
						);
						res.status(response.status).json({
							status: response.status,
							message: response.data.message,
						});
					} catch (err) {
						console.log(err);
						res.status(500).json({ message: "Internal Server Error" });
					}
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "Internal Server Error" });
				return;
			});
	});
};

export const editAccount = async (req: Request, res: Response) => {
	if (req.body.firstName !== undefined) {
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;
		User.findByPk(user_id)
			.then((user: User | null) => {
				if (user == null) {
					res.status(404).json({ message: "error.T_NOT_FOUND", status: 404 });
					return;
				}
				user
					.update({
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						birthDate: req.body.birthDate,
					})
					.then(() => {
						res
							.status(200)
							.json({ message: "response.T_USER_UPDATE", status: 200 });
						return;
					})
					.catch((err) => {
						console.log(err);
						res
							.status(500)
							.json({ message: "error.T_INTERNAL_SERVER_ERROR", status: 500 });
						return;
					});
			})
			.catch((err) => {
				console.log(err);
				res
					.status(500)
					.json({ message: "error.T_INTERNAL_SERVER_ERROR", status: 500 });
				return;
			});
	} else {
		res.status(400).json({ message: "error.T_BAD_REQ", status: 400 });
	}
};

export const editPassword = async (req: Request, res: Response) => {
	if (
		req.body.newPassword !== undefined &&
		req.body.currentPassword !== undefined
	) {
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;
		User.findByPk(user_id).then((user: User | null) => {
			if (user == null) {
				res.status(404).json({ message: "error.T_NOT_FOUND", status: 404 });
				return;
			}
			bcrypt.compare(
				req.body.currentPassword,
				user.password,
				(err: Error | undefined, result: boolean) => {
					if (err) {
						console.log(err);
						res
							.status(500)
							.json({ message: "error.T_INTERNAL_SERVER_ERROR", status: 500 });
						return;
					}
					if (result) {
						bcrypt.genSalt(config.saltRounds, (err, salt) => {
							if (!err) {
								bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
									if (!err) {
										user
											.update({ password: hash })
											.then(() => {
												res.status(200).json({
													message: "response.T_USER_UPDATE",
													status: 200,
												});
												return;
											})
											.catch((err) => {
												console.log(err);
												res.status(500).json({
													message: "error.T_INTERNAL_SERVER_ERROR",
													status: 500,
												});
												return;
											});
									} else {
										console.log(err);
										res.status(500).json({
											message: "error.T_INTERNAL_SERVER_ERROR",
											status: 500,
										});
										return;
									}
								});
							} else {
								console.log(err);
								res.status(500).json({
									message: "error.T_INTERNAL_SERVER_ERROR",
									status: 500,
								});
								return;
							}
						});
					} else {
						res
							.status(401)
							.json({ message: "error.T_UNAUTHORIZED", status: 401 });
						return;
					}
				}
			);
		});
	} else {
		res.status(400).json({ message: "error.T_BAD_REQ", status: 400 });
		return;
	}
};
