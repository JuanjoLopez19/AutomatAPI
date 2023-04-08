import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middleware/multer.middleware";
import passport from "passport";

import { makeFlaskTemplate } from "../controllers/templates.controllers";

const routerTemplates = Router();

routerTemplates.post(
	"/flask",
	[
		passport.authorize("jwt"),
		upload.fields([{ name: "cert" }, { name: "key" }]),
	],
	makeFlaskTemplate
);

export default routerTemplates;
