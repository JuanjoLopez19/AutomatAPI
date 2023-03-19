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
						.json({ message: "Username or email already in use", status: 400 })
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
								.json({
									message: "Username or email already in use",
									status: 400,
								})
								.send();
							return;
						}
						next();
					})
					.catch((err: any) => {
						res
							.status(500)
							.contentType("application/json")
							.json({ message: err.message, status: 500 })
							.send();
					});
			})
			.catch((err: any) => {
				res
					.status(500)
					.contentType("application/json")
					.json({ message: err.message, status: 500 })
					.send();
				return;
			});
	} else
		res
			.status(400)
			.contentType("application/json")
			.json({ message: "Username or email not provided", status: 400 })
			.send();
	return;
};

export const verifySignIn = (req: Request, res: Response, next: any) => {
	if (req.body.email != undefined && req.body.password != undefined) {
		try {
			User.findOne({
				where: {
					email: req.body.email,
				},
			})
				.then((user: User | null) => {
					if (user) {
						let passwordIsValid = bcrypt.compareSync(
							req.body.password,
							// @ts-ignore: Object is possibly 'null'.
							user.password || ""
						);

						if (!passwordIsValid) {
							return res.status(401).send({
								message: "Invalid Password!",
								status: 401,
							});
						}

						res.locals.user = user;
						next();
					} else {
						res
							.status(404)
							.contentType("application/json")
							.json({ message: "User not found", status: 404 })
							.send();
						return;
					}
				})
				.catch((err: any) => {
					res
						.status(404)
						.contentType("application/json")
						.json({ message: err.message, status: 404 })
						.send();
					return;
				});
		} catch (err: any) {
			res
				.status(500)
				.contentType("application/json")
				.json({ message: err.message, status: 500 })
				.send();
			return;
		}
	} else {
		res
			.status(400)
			.contentType("application/json")
			.json({ message: "Bad Request", status: 400 })
			.send();
		return;
	}
};
