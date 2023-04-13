import { Router } from "express";
import passport from "../passport";
import { getUsers } from "../controllers/user.controller";
import { isAdmin } from "../middleware/auth.middelware";

const routerUser = Router();

routerUser.get("/", [passport.authorize("jwt"), isAdmin], getUsers)

export default routerUser;