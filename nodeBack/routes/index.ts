import { Router } from "express";
import routerAuth from "./auth.routes";
import routerUser from "./user.routes";
import routerTemplates from "./templates.routes";

const routes: Router = Router();

routes.use("/auth", routerAuth);
routes.use("/user", routerUser);
routes.use("/templates", routerTemplates)

export default routes;
