import { Router } from "express";
import { Request, Response } from "express";
import { Signin, Signout, Signup } from "../controllers/auth.controller";
import { verifySignUp, verifySignIn } from "../middleware/authMiddelware";

const routerAuth = Router();

routerAuth.use((req: Request, res: Response, next) => {
	res.header(
		"Access-Control-Allow-Origin",
		"*"
	);
	next();
});
routerAuth.post("/signup", [verifySignUp], Signup);
routerAuth.post("/signin", [verifySignIn], Signin);
routerAuth.post("/logout", Signout);
export default routerAuth;
