import { Router } from "express";
import { Request, Response } from "express";
import {
	activateAccount,
	CompleteRegistration,
	genSession,
	rememberPassword,
	resetPassword,
	Signin,
	Signout,
	Signup,
} from "../controllers/auth.controller";
import { verifySignUp, verifySignIn } from "../middleware/auth.middelware";
import jwt from "jsonwebtoken";
import config from "../config/config";
import User from "../database/models/user";
import passport from "passport";

const routerAuth = Router();

routerAuth.post("/signup", [verifySignUp], Signup);
routerAuth.post("/signin", [verifySignIn], Signin);
routerAuth.get("/signout", [passport.authorize("jwt")], Signout);

routerAuth.put("/activate_account", activateAccount);
routerAuth.get("/remember_password", rememberPassword);
routerAuth.put("/reset_password", resetPassword);

routerAuth.get("/succes/google", (req: Request, res: Response) => {
	// @ts-ignore
	req.sessionStore?.all((err: Error, sessions: any) => {
		const sessionsList = Object.keys(sessions);

		const id = sessions[sessionsList[sessionsList.length - 1]].passport.user;

		if (id) {
			const token = jwt.sign({ id: id }, config.secretKey, {
				expiresIn: "120s",
			});
			User.findOne({ where: { id: id } }).then((user) => {
				if (user) {
					if (!user.activeUser) {
						res
							.status(200)
							.cookie("socialAuth", token, { httpOnly: true, secure: false })
							.redirect(
								`${config.front}${config.completeRoute}?token=${user.access_token}&type=google`
							);
					} else {
						const token = jwt.sign(
							{
								id: user.id,
							},
							config.secretKey,
							{
								expiresIn: `${config.expiration}s`,
							}
						);
						res
							.status(200)
							.cookie("jwt", token, { httpOnly: true, secure: false })
							.redirect(config.front);
					}
				}
			});
		}
	});
});

routerAuth.get("/succes/github", (req: Request, res: Response) => {
	// @ts-ignore
	req.sessionStore?.all((err: Error, sessions: any) => {
		const sessionsList = Object.keys(sessions);
		const id = sessions[sessionsList[sessionsList.length - 1]].passport.user;

		if (id) {
			const tokenAuth = jwt.sign({ id: id }, config.secretKey, {
				expiresIn: "120s",
			});
			User.findOne({ where: { id: id } }).then((user) => {
				if (user) {
					if (!user.activeUser) {
						res
							.status(200)
							.cookie("socialAuth", tokenAuth, {
								httpOnly: true,
								secure: false,
							}) // Redirect to the socialAuthGoogle component in the front to add the things
							.redirect(
								`${config.front}${config.completeRoute}?token=${user.access_token}&type=github`
							);
					} else {
						const token = jwt.sign(
							{
								id: user.id,
							},
							config.secretKey,
							{
								expiresIn: `${config.expiration}s`,
							}
						);
						res
							.status(200)
							.cookie("jwt", token, { httpOnly: true, secure: false })
							.redirect(config.front);
					}
				}
			});
		}
	});
});

routerAuth.get("/failure", (req: Request, res: Response) => {
	res.redirect("http://localhost:4200/#/forbidden");
});

routerAuth.post(
	"/complete_registration",
	[verifySignUp, passport.authorize("jwtSocialAuth")],
	CompleteRegistration
);

routerAuth.get(
	"/authorize",
	passport.authorize("jwt"),
	(req: Request, res: Response) => {
		res.status(200).send({ status: 200 });
	}
);

routerAuth.get("/generate_session", passport.authorize("jwt"), genSession);

export default routerAuth;
