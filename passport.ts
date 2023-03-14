import { Request } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
const JWTStrategy = passportJWT.Strategy;
import config from "./config/config";

const cookieExtractor = (req: Request) => {
	let jwt = null;

	if (req && req.cookies) {
		jwt = req.cookies["jwt"];
	}

	return jwt;
};

passport.use(
	"jwt",
	new JWTStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: config.secretKey,
		},
		(jwtPayload, done) => {
			const { expiration } = jwtPayload;

			if (Date.now() > expiration) {
				done("Unauthorized", false);
			}

			done(null, jwtPayload);
		}
	)
);
