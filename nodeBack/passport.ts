import { Request } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
const JWTStrategy = passportJWT.Strategy;
import config from "./config/config";
import google from "./middleware/social/google.middelware";
import github from "./middleware/social/github.middelware";
import twitter from "./middleware/social/twitter.middleware";

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

passport.use("google", google);
passport.use("github", github);
passport.use("twitter", twitter);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
	done(null, user);
});

export default passport;
