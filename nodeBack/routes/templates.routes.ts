import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middleware/multer.middleware";
import passport from "passport";

const routerTemplates = Router();

routerTemplates.post(
	"/flask",
	[
		passport.authorize("jwt"),
		upload.fields([{ name: "cert" }, { name: "key" }]),
	],
	(req: any, res: Response) => {
		console.log(req.aws_key_cert);
		console.log(req.aws_key_key); // In this items there are the keys to the files in S3, should be saved in the DB hashed(?)
		res.send("flask");
	}
);

export default routerTemplates;
