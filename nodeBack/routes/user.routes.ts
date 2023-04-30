import { Router } from "express";
import passport from "../passport";
import {
	getUsers,
	deleteUser,
	deleteAccount,
	editAccount,
	editPassword,
    editAccountAdmin,
    editPasswordAdmin,
	getUserInfo
} from "../controllers/user.controller";
import { isAdmin, verifyEdit } from "../middleware/auth.middelware";

const routerUser = Router();

routerUser.get("/", [passport.authorize("jwt"), isAdmin], getUsers);
routerUser.delete("/delete", [passport.authorize("jwt"), isAdmin], deleteUser);

routerUser.delete("/deleteAccount", [passport.authorize("jwt")], deleteAccount);

routerUser.put(
	"/editAccount",
	[passport.authorize("jwt"), verifyEdit],
	editAccount
);
routerUser.put("/editPassword", [passport.authorize("jwt")], editPassword);

routerUser.put(
	"/editAccountAdmin",
	[passport.authorize("jwt"), verifyEdit, isAdmin],
	editAccountAdmin
);
routerUser.put("/editPasswordAdmin", [passport.authorize("jwt"), isAdmin], editPasswordAdmin);

routerUser.get("/getUserInfo", passport.authorize("jwt"), getUserInfo);

export default routerUser;
