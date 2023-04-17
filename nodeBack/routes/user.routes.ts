import { Router } from "express";
import passport from "../passport";
import { getUsers, deleteUser, deleteAccount } from "../controllers/user.controller";
import { isAdmin } from "../middleware/auth.middelware";

const routerUser = Router();

routerUser.get("/", [passport.authorize("jwt"), isAdmin], getUsers)
routerUser.delete("/delete", [passport.authorize("jwt"), isAdmin], deleteUser)

routerUser.delete("/deleteAccount", [passport.authorize("jwt")], deleteAccount)

export default routerUser;