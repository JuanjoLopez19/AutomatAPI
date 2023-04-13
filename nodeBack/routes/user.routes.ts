import { Router } from "express";
import passport from "../passport";
import { getUsers, deleteUser } from "../controllers/user.controller";
import { isAdmin } from "../middleware/auth.middelware";

const routerUser = Router();

routerUser.get("/", [passport.authorize("jwt"), isAdmin], getUsers)
routerUser.delete("/delete", [passport.authorize("jwt"), isAdmin], deleteUser)

export default routerUser;