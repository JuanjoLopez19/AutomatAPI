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
import passport from "passport";

const routerAuth = Router();

routerAuth.post("/signup", [verifySignUp], Signup);
routerAuth.post("/signin", [verifySignIn], Signin);
routerAuth.post("/logout", Signout);

routerAuth.put("/activate_account", activateAccount);
routerAuth.get("/remember_password", rememberPassword);
routerAuth.put("/reset_password", resetPassword);

routerAuth.get(
	"/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

routerAuth.get(
	"/google/callback",
	passport.authenticate(
		"google",
		{
			failureRedirect: "/api/auth/failure",
			session: false,
		},
		(req: Request, res: Response) => {
			handleSocialLoginCallback(req, res);
		}
	)
);

routerAuth.get("/github", passport.authenticate("github", { scope: ["user"] }));

routerAuth.get(
	"/github/callback",
	passport.authenticate(
		"github",
		{
			failureRedirect: "/api/auth/failure",
			session: false,
		},
		(req: Request, res: Response) => {
			handleSocialLoginCallback(req, res);
		}
	)
);

routerAuth.get("/twitter", passport.authenticate("twitter", { scope: ["user"] }));

routerAuth.get(
	"/twitter/callback",
	passport.authenticate(
		"twitter",
		{
			failureRedirect: "/api/auth/failure",
			session: false,
		},
		(req: Request, res: Response) => {
			handleSocialLoginCallback(req, res);
		}
	)
);

routerAuth.get("/succes", (req: Request, res: Response) => {
	res.redirect("http://localhost:4200/#/home");
});

routerAuth.get("/failure", (req: Request, res: Response) => {
	res.redirect("http://localhost:4200/#/forbidden");
});

async function handleSocialLoginCallback(req: any, res: any) { //Change this to the correct url
	if (req) {
		return res.redirect("http://localhost:4200/#/home");
	} else {
		return res.redirect("http://localhost:4200/#/forbidden");
	}
}
export default routerAuth;
