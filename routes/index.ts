import { Router } from "express";
import { Request, Response } from "express";
import routerAuth from "./auth.routes";
import routerUser from "./user.routes";

const routes: Router = Router();

routes.use("/auth", routerAuth);
routes.use("/user", routerUser);

export default routes;