import db from "../database/database";
import User from "../database/models/user";
import { Request, Response } from "express";

const verifySignup = (req: Request, res: Response, next: any) => {
	// Username Check
	if (req.body.username != undefined && req.body.username != undefined) {
		User.findOne({
			where: {
				username: req.body.username,
			},
		})
			.then((user: User | null) => {
				if (user) {
					res
						.status(400)
						.contentType("application/json")
						.json({ error: "Username or email already in use" })
						.send();
					return;
				}

				// Email Check
				User.findOne({
					where: {
						email: req.body.email,
					},
				})
					.then((user: User | null) => {
						if (user) {
							res
								.status(400)
								.contentType("application/json")
								.json({ error: "Username or email already in use" })
								.send();
							return;
						}
						next();
					})
					.catch((err: any) => {
						res
							.status(500)
							.contentType("application/json")
							.json({ error: err.message })
							.send();
					});
			})
			.catch((err: any) => {
				res
					.status(500)
					.contentType("application/json")
					.json({ error: err.message })
					.send();
				return;
			});
	} else
		res
			.status(400)
			.contentType("application/json")
			.json({ error: "Username or email not provided" })
			.send();
	return;
};

export default verifySignup;
