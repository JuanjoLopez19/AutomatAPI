import User from "../database/models/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const verifySignUp = (req: Request, res: Response, next: any) => {
	// Username Check
	if (req.body.username != undefined && req.body.email != undefined) {
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

export const verifySignIn = (req: Request, res: Response, next: any) => {
	if (req.body.username != undefined && req.body.password != undefined) {
		try {
			User.findOne({
				where: {
					username: req.body.username,
				},
			})
				.then((user: User | null) => {
					console.log("Pre select pwf")
					let passwordIsValid = bcrypt.compareSync(
						req.body.password,
						// @ts-ignore: Object is possibly 'null'.
						user.password || ""
					);

					if (!passwordIsValid) {
						return res.status(401).send({
							message: "Invalid Password!",
						});
					}

					res.locals.user = user;
					console.log("Post select user")
					next();
				})
				.catch((err: any) => {
					res
						.status(404)
						.contentType("application/json")
						.json({ error: err.message })
						.send();
					return;
				});
		} catch (err: any) {
			res
				.status(500)
				.contentType("application/json")
				.json({ error: err.message })
				.send();
			return;
		}
	} else {
		res
			.status(400)
			.contentType("application/json")
			.json({ error: "Bad Request" })
			.send();
		return;
	}
};
