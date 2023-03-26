import { Router } from "express";
import { Request, Response } from "express";
import {
	activateAccount,
	rememberPassword,
	resetPassword,
	Signin,
	Signout,
	Signup,
} from "../controllers/auth.controller";
import { verifySignUp, verifySignIn } from "../middleware/auth.middelware";
import middleware from "../passport"

const routerAuth = Router();

routerAuth.post("/signup", [verifySignUp], Signup);
routerAuth.post("/signin", [verifySignIn], Signin);
routerAuth.post("/logout", Signout);

routerAuth.put("/activate_account", activateAccount);
routerAuth.get("/remember_password", rememberPassword);
routerAuth.put("/reset_password", resetPassword);

routerAuth.get(
	"/google",
	middleware.authenticate("googl", { scope: ["profile", "email"] })
);

routerAuth.get("/google/callback", (req: Request, res: Response) => {
	middleware.authenticate("google", { session: false }),
		(req:any, res:any) => {
			handleSocialOauthCallback(req, res);
		};
});

async function handleSocialOauthCallback(req:any, res:any) {
	if (req.socialOauth2Success) {
		return res.redirect(
			process.env.expressHost +
				"generate-session?token=" +
				req.user.authorizationToken
		);
	} else {
		return res.redirect(process.env.expressHost + "#/forbidden");
	}
}
export default routerAuth;
