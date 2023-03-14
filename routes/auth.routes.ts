import { Router } from "express";
import { Request, Response } from "express";
import { Signin, Signup } from "../controllers/auth.controller";
import verifySignup from "../middleware/verifySignup";

const routerAuth = Router();

routerAuth.use((req: Request, res: Response, next) => {
	res.header(
		"Access-Control-Allow-Origin",
		"x-access-token, Origin, Content-Type, Accept"
	);
	next();
});
routerAuth.post("/signup", [verifySignup], Signup);
routerAuth.post("/signin", Signin);
export default routerAuth;
