import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middleware/multer.middleware";
import passport from "passport";

import {
	makeFlaskTemplate,
	makeExpressTemplate,
	makeDjangoTemplate,
	getTemplates,
	deleteTemplate,
	getToken,
	getTemplatesStats
} from "../controllers/templates.controllers";
import { isAdmin } from "../middleware/auth.middelware";

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

routerTemplates.get("/", passport.authorize("jwt"), getTemplates);

routerTemplates.delete(
	"/deleteTemplate",
	passport.authorize("jwt"),
	deleteTemplate
);

routerTemplates.post("/getToken", passport.authorize("jwt"), getToken);

routerTemplates.get("/getTemplateStats", [passport.authorize("jwt"), isAdmin], getTemplatesStats )

export default routerTemplates;
