import { Request, Response } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";
import axios from "axios";

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
			res.status(500).json({ message: "Internal Server Error" });
		}
	} else {
		res.status(400).json({ message: "Bad Request" });
	}
};
