import { Request, Response } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";
import axios, { AxiosRequestConfig } from "axios";
import User from "../database/models/user";
import Templates, { Tokens } from "../database/models/templates";
import {
	decryptData,
	deleteItemsAWS,
	encryptData,
} from "../middleware/auxiliaryFunctions";
import { Op, WhereOptions } from "sequelize";

export const makeFlaskTemplate = async (req: any, res: Response) => {
	if (
		req.body.tech !== undefined &&
		req.body.tech_type !== undefined &&
		req.body.template_data !== undefined
	) {
		const { tech, tech_type, template_data } = req.body;
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;

		const aws_key_cert = req.aws_key_cert ? req.aws_key_cert : null;
		const aws_key_key = req.aws_key_key ? req.aws_key_key : null;

		try {
			const response = await axios.post(
				`${config.python.host}:${config.python.port}/templates`,
				{
					tech: tech,
					tech_type: tech_type,
					template_data: template_data,
					aws_key_cert: aws_key_cert,
					aws_key_key: aws_key_key,
					user_id: user_id,
				}
			);
			const token = response.data.data;
			const template_id = response.data.template_id;
			Tokens.create({
				template_token: encryptData(token),
				template_id: template_id,
				cert_key: aws_key_cert === null ? undefined : encryptData(aws_key_cert),
				private_key:
					aws_key_key === null ? undefined : encryptData(aws_key_key),
			})
				.then((token: any) => {
					if (!token) {
						res.status(500).json({ message: "Internal Server Error" });
					}
					res.status(response.status).json(response.data);
				})
				.catch((err: Error) => {
					console.log(err);
					res.status(500).json({ message: "Internal Server Error" });
				});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	} else {
		res.status(400).json({ message: "Bad Request" });
	}
};

export const makeExpressTemplate = async (req: any, res: Response) => {
	if (
		req.body.tech !== undefined &&
		req.body.tech_type !== undefined &&
		req.body.template_data !== undefined
	) {
		const { tech, tech_type, template_data } = req.body;
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;

		const aws_key_cert = req.aws_key_cert ? req.aws_key_cert : null;
		const aws_key_key = req.aws_key_key ? req.aws_key_key : null;

		try {
			const response = await axios.post(
				`${config.python.host}:${config.python.port}/templates`,
				{
					tech: tech,
					tech_type: tech_type,
					template_data: template_data,
					aws_key_cert: aws_key_cert,
					aws_key_key: aws_key_key,
					user_id: user_id,
				}
			);
			const token = response.data.data;
			const template_id = response.data.template_id;
			Tokens.create({
				template_token: encryptData(token),
				template_id: template_id,
				cert_key: aws_key_cert === null ? undefined : encryptData(aws_key_cert),
				private_key:
					aws_key_key === null ? undefined : encryptData(aws_key_key),
			})
				.then((token: any) => {
					if (!token) {
						res.status(500).json({ message: "Internal Server Error" });
					}
					res.status(response.status).json(response.data);
				})
				.catch((err: Error) => {
					console.log(err);
					res.status(500).json({ message: "Internal Server Error" });
				});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	} else {
		res.status(400).json({ message: "Bad Request" });
	}
};

export const makeDjangoTemplate = async (req: any, res: Response) => {
	if (
		req.body.tech !== undefined &&
		req.body.tech_type !== undefined &&
		req.body.template_data !== undefined
	) {
		const { tech, tech_type, template_data } = req.body;
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;

		const aws_key_cert = req.aws_key_cert ? req.aws_key_cert : null;
		const aws_key_key = req.aws_key_key ? req.aws_key_key : null;

		try {
			const response = await axios.post(
				`${config.python.host}:${config.python.port}/templates`,
				{
					tech: tech,
					tech_type: tech_type,
					template_data: template_data,
					aws_key_cert: aws_key_cert,
					aws_key_key: aws_key_key,
					user_id: user_id,
				}
			);
			const token = response.data.data;
			const template_id = response.data.template_id;
			Tokens.create({
				template_token: encryptData(token),
				template_id: template_id,
				cert_key: aws_key_cert === null ? undefined : encryptData(aws_key_cert),
				private_key:
					aws_key_key === null ? undefined : encryptData(aws_key_key),
			})
				.then((token: any) => {
					if (!token) {
						res.status(500).json({ message: "Internal Server Error" });
					}
					res.status(response.status).json(response.data);
				})
				.catch((err: Error) => {
					console.log(err);
					res.status(500).json({ message: "Internal Server Error" });
				});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Internal Server Error", status: 500 });
		}
	} else {
		res.status(400).json({ message: "Bad Request", status: 400 });
	}
};

export const getTemplates = async (req: Request, res: Response) => {
	//@ts-ignore
	const user_id = await jwt.decode(req.cookies["jwt"]).id;
	User.findByPk(user_id)
		.then((user: User | null) => {
			if (user == null) {
				res.status(404).json({ message: "User not found", status: 404 });
			} else {
				if (user.role == "admin") {
					Templates.findAll()
						.then((templates: Templates[]) => {
							if (templates == null)
								res
									.status(404)
									.json({ message: "No templates found", status: 404 });
							else
								res
									.status(200)
									.json({ data: templates, status: 200, message: "Success" });
						})
						.catch((err) => {
							console.log(err);
							res
								.status(500)
								.json({ message: "Internal Server Error", status: 500 });
						});
				} else {
					Templates.findAll({
						where: {
							user_id: user_id,
						},
					})
						.then((templates: Templates[]) => {
							if (templates == null)
								res
									.status(404)
									.json({ message: "No templates found", status: 404 });
							else
								res
									.status(200)
									.json({ data: templates, status: 200, message: "Success" });
						})
						.catch((err) => {
							console.log(err);
							res
								.status(500)
								.json({ message: "Internal Server Error", status: 500 });
						});
				}
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: "Internal Server Error", status: 500 });
		});
};

export const deleteTemplate = async (req: Request, res: Response) => {
	if (req.body.template_id !== undefined) {
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;
		try {
			Templates.findOne({
				where: {
					user_id: user_id,
					id: req.body.template_id,
				} as WhereOptions<Templates>,
			})
				.then((template: Templates | null) => {
					if (template == null) {
						res
							.status(404)
							.json({ message: "Template not found", status: 404 });
					} else {
						Tokens.findOne({
							where: {
								template_id: req.body.template_id,
							} as WhereOptions<Tokens>,
						})
							.then((token: Tokens | null) => {
								if (token == null) {
									res
										.status(404)
										.json({ message: "Token not found", status: 404 });
								} else {
									{
										deleteItemsAWS(
											[token.cert_key || "", token.private_key || ""],
											token.template_token
										);
										token
											.destroy()
											.then(async () => {
												const body = { user_id: user_id };
												const response = await axios.delete(
													`${config.python.host}:${config.python.port}/templates/${req.body.template_id}/delete`,
													{
														data: body,
													} as AxiosRequestConfig
												);

												res.status(response.status).json({
													status: response.status,
													message: response.data.message,
												});
											})
											.catch((err) => {
												console.log(err);
												res.status(500).json({
													message: "Internal Server Error",
													status: 500,
												});
											});
									}
								}
							})
							.catch((err) => {
								console.log(err);
								res
									.status(500)
									.json({ message: "Internal Server Error", status: 500 });
							});
					}
				})
				.catch((err) => {
					console.log(err);
					res
						.status(500)
						.json({ message: "Internal Server Error", status: 500 });
				});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Internal Server Error", status: 500 });
		}
	} else {
		res.status(400).json({ message: "Bad Request", status: 400 });
	}
};

export const updateTemplate = async (req: Request, res: Response) => {
	if (
		req.body.template_id !== undefined &&
		req.body.template_data !== undefined
	) {
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;
		const { template_id, template_data, create_temp } = req.body;
		try {
			const response = await axios.post(
				`${config.python.host}:${config.python.port}/templates/${template_id}/update`,
				{
					template_data: template_data,
					user_id: user_id,
					create_temp: create_temp,
				}
			);
			console.log(response.status);
			res.status(response.status).json(response.data);
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Internal Server Error", status: 500 });
		}
	} else {
		res.status(400).json({ message: "Bad Request", status: 400 });
	}
};

export const getToken = async (req: Request, res: Response) => {
	if (req.body.template_id !== undefined) {
		//@ts-ignore
		const user_id = await jwt.decode(req.cookies["jwt"]).id;
		Templates.findOne({
			where: {
				id: req.body.template_id,
				user_id: user_id,
			},
		})
			.then((template: Templates | null) => {
				if (template == null) {
					res.status(404).json({ message: "Template not found", status: 404 });
				} else {
					Tokens.findOne({
						where: {
							template_id: template.id,
						},
					})
						.then((token: Tokens | null) => {
							if (token == null) {
								res
									.status(404)
									.json({ message: "Token not found", status: 404 });
							} else {
								const tokenDecrypt = decryptData(token.template_token);

								res.status(200).json({
									data: tokenDecrypt,
									status: 200,
									message: "Success",
								});
							}
						})
						.catch((err) => {
							console.log(err);
							res
								.status(500)
								.json({ message: "Internal Server Error", status: 500 });
						});
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: "Internal Server Error", status: 500 });
			});
	} else {
		res.status(400).json({ message: "Bad Request", status: 400 });
	}
};
