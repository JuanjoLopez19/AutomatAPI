import express, { Express, Request, Response, NextFunction } from "express";
import BodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import passport from "passport";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import * as swaggerdocs from "./reference/express-API.json";
import Session from "express-session";
import config from "./config/config";
import "./passport";

const app: Express = express();

app.use(BodyParser.json());

app.use(cors());
app.use(
	morgan(
		':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
	)
);
app.use(
	Session({
		secret: config.sessionSecret,
		resave: true,
		saveUninitialized: true,
		cookie: { secure: true },
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session()); // Need to use session for social auth

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerdocs));
app.use("/api", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
	next();
});

app.use(function (
	err: { message: any; status: any },
	req: Request,
	res: Response,
	next: NextFunction
) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 404).send({ message: "Unknown route" });
});

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

// Google social auth
app.get(
	"/api/auth/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
	"/api/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: `http://localhost:${config.port}/api/auth/failure`,
		successRedirect: `http://localhost:${config.port}/api/auth/succes/google`,
	})
);

// Github social auth
app.get(
	"/api/auth/github",
	passport.authenticate("github", { scope: ["user"] })
);
app.get(
	"/api/auth/github/callback",
	passport.authenticate("github", {
		failureRedirect: `http://localhost:${config.port}/api/auth/failure`,
		successRedirect: `http://localhost:${config.port}/api/auth/succes/github`,
	})
);

// Twitter social auth
app.get(
	"/api/auth/twitter",
	passport.authenticate("twitter")
);

app.get(
	"/api/auth/twitter/callback",
	passport.authenticate("twitter", {
		failureRedirect: `http://localhost:${config.port}/api/auth/failure`,
		successRedirect: `http://localhost:${config.port}/api/auth/succes/twitter`,
	})
);

export default app;