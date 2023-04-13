import { Request, Response } from "express";
import User from "../database/models/user";
export const getUsers = async (req: Request, res: Response) => {
	if (req.user) {
		const users = await User.findAll({attributes: {exclude: ["password"]}});
		res.status(200).json({data: users, message: "Users found"});
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
};
