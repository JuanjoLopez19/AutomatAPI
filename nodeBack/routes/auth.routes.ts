import { Router } from "express";
import { Request, Response } from "express";
import { Signin, Signout, Signup } from "../controllers/auth.controller";
import { verifySignUp, verifySignIn } from "../middleware/auth.middelware";

const routerAuth = Router();

routerAuth.use((req: Request, res: Response, next) => {
	res.header(
		"Access-Control-Allow-Origin",
		"x-access-token, Origin, Content-Type, Accept"
	);
	next();
});
routerAuth.post("/signup", [verifySignUp], Signup);
routerAuth.post("/signin", [verifySignIn], Signin);
routerAuth.post("/logout", Signout);
export default routerAuth;
