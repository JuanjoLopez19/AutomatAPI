import { Router } from "express";
import upload from "../middleware/multer.middleware";
import passport from "passport";

import {
	makeFlaskTemplate,
	makeExpressTemplate,
	makeDjangoTemplate,
	getTemplates,
	deleteTemplate,
	getToken,
	getTemplatesStats,
	getUserTemplatesStats,
	deleteTemplateAdmin,
	getTemplateConfig,
	editTemplate,
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

routerTemplates.delete(
	"/deleteTemplateAdmin",
	[passport.authorize("jwt"), isAdmin],
	deleteTemplateAdmin
);

routerTemplates.post("/getToken", passport.authorize("jwt"), getToken);

routerTemplates.get(
	"/getTemplateStats",
	[passport.authorize("jwt"), isAdmin],
	getTemplatesStats
);
routerTemplates.get(
	"/getUserTemplateStats",
	[passport.authorize("jwt")],
	getUserTemplatesStats
);

routerTemplates.post(
	"/getTemplateConfig",
	[passport.authorize("jwt")],
	getTemplateConfig
);

routerTemplates.put(
	"/editTemplate",
	[
		passport.authorize("jwt"),
		upload.fields([{ name: "cert" }, { name: "key" }]),
	],
	editTemplate
);

export default routerTemplates;
