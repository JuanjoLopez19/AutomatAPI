import { Request, Response } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../database/models/user";
import Templates from "../database/models/templates";

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
			console.log(response.status);
			res.status(response.status).json(response.data);
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
			console.log(response.status);
			res.status(response.status).json(response.data);
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
			const response = await axios.post(
				`${config.python.host}:${config.python.port}/templates/${req.body.template_id}/delete`,
				{
					user_id: user_id,
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
