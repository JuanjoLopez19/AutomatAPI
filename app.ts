import express, { Express, Request, Response, NextFunction } from "express";
import BodyParser from "body-parser";
import cors from "cors";
import db from "./database/database";
import dbInit from "./database/init";
import user from "./database/models/user";
dbInit();
user.findAll().then((users) => console.log(users));
const app: Express = express();
app.use(BodyParser.json());
app.use(cors());


app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

// error handler
app.use(function (
	err: { message: any; status: any },
	req: Request,
	res: Response,
	next: NextFunction
) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

export default app;
