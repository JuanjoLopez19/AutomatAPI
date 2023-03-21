import express, { Express, Request, Response, NextFunction } from "express";
import BodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import passport from "passport";
import cookieParser from 'cookie-parser'
import swaggerUi from "swagger-ui-express";
import * as swaggerdocs from "./reference/express-API.json";

const app: Express = express();

app.use(BodyParser.json());

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerdocs));
app.use("/api", routes);

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
	res.status(err.status || 404).send({ message: "Unknown route" });
});

export default app;
