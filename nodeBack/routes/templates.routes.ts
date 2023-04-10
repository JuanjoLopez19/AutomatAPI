import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middleware/multer.middleware";
import passport from "passport";

import {
	makeFlaskTemplate,
	makeExpressTemplate,
	makeDjangoTemplate,
} from "../controllers/templates.controllers";

const routerTemplates = Router();

routerTemplates.post(
	"/flask",
	[
		passport.authorize("jwt"),
		upload.fields([{ name: "cert" }, { name: "key" }]),
	],
	makeFlaskTemplate
);

routerTemplates.post(
	"/express",
	[
		passport.authorize("jwt"),
		upload.fields([{ name: "cert" }, { name: "key" }]),
	],
	makeExpressTemplate
);

routerTemplates.post(
	"/django",
	[
		passport.authorize("jwt"),
		upload.fields([{ name: "cert" }, { name: "key" }]),
	],
	makeDjangoTemplate
);

export default routerTemplates;
