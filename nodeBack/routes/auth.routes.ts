import { Router } from "express";
import { Request, Response } from "express";
import { activateAccount, rememberPassword, resetPassword, Signin, Signout, Signup } from "../controllers/auth.controller";
import { verifySignUp, verifySignIn } from "../middleware/auth.middelware";

const routerAuth = Router();

routerAuth.post("/signup", [verifySignUp], Signup);
routerAuth.post("/signin", [verifySignIn], Signin);
routerAuth.post("/logout", Signout);

routerAuth.put("/activate_account", activateAccount)
routerAuth.get("/remember_password", rememberPassword)
routerAuth.put("/reset_password", resetPassword)
export default routerAuth;
