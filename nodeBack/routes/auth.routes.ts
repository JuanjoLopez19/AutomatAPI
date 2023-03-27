import { request, Router } from "express";
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

// Google social auth
routerAuth.get(
	"/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);
routerAuth.get(
	"/google/callback",
	passport.authenticate(
		"google",
		{
			session: false,
		},
		(req, res) => {
			console.log(req.user)
			handleSocialOauthCallback(req, res);
		}
	)
);

// Github social auth
routerAuth.get("/github", passport.authenticate("github", { scope: ["user"] }));
routerAuth.get(
	"/github/callback",
	passport.authenticate(
		"github",
		{
			failureRedirect: "/api/auth/failure",
			session: false,
		},
		(req: Request, res: Response) => {}
	)
);

routerAuth.get("/succes", (req: Request, res: Response) => {
	console.log("succes");
	console.log(res);
	res.redirect("http://localhost:4200/#/home");
});

routerAuth.get("/failure", (req: Request, res: Response) => {
	res.redirect("http://localhost:4200/#/forbidden");
});

function handleSocialOauthCallback(req:any, res:any) {
	console.log("handleSocialOauthCallback");
    if (req.socialAuthSuccess) {
      res.redirect("http://localhost:4200/#/home");
    } else {
      res.redirect("http://localhost:4200/#/forbidden"); 
    }
}

export default routerAuth;
