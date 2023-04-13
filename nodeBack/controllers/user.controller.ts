import e, { Request, Response } from "express";
import User from "../database/models/user";
import config from "../config/config";
import axios, { AxiosRequestConfig } from "axios";

export const getUsers = async (req: Request, res: Response) => {
	if (req.user) {
		const users = await User.findAll({ attributes: { exclude: ["password"] } });
		res.status(200).json({ data: users, message: "Users found", status: 200 });
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	if (req.user) {
		const user = req.user as any;
		const response = await axios.delete(
			`${config.python.host}:${config.python.port}/users/${user.id}/delete`
		);
		console.log(response.status);
		res.status(response.status).json(response.data);
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
};
