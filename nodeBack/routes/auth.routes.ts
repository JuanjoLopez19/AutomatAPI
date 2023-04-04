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

const routerAuth = Router();

routerAuth.post("/signup", [verifySignUp], Signup);
routerAuth.post("/signin", [verifySignIn], Signin);
routerAuth.post("/logout", Signout);

routerAuth.put("/activate_account", activateAccount);
routerAuth.get("/remember_password", rememberPassword);
routerAuth.put("/reset_password", resetPassword);

routerAuth.get("/succes/google", (req: Request, res: Response) => {
	console.log("succes");

	res.redirect("/");
});

routerAuth.get("/succes/github", (req: Request, res: Response) => {
	console.log("succes GIT");

	res.redirect("/");
});

routerAuth.get("/failure", (req: Request, res: Response) => {
	res.redirect("http://localhost:4200/#/forbidden");
});

export default routerAuth;
