import { Request } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
import config from "./config/config";
import google from "./middleware/social/google.middelware";
import github from "./middleware/social/github.middelware";
import User, { UserAttributes } from "./database/models/user";

const JWTStrategy = passportJWT.Strategy;

const cookieExtractorSession = (req: Request) => {
	let jwt = null;

	if (req && req.cookies) {
		jwt = req.cookies["jwt"];
	}

	return jwt;
};

const cookieExtractorSocialAuth = (req: Request) => {
	let jwt = null;

	if (req && req.cookies) {
		jwt = req.cookies["socialAuth"];
	}

	return jwt;
};

const jwtSession = new JWTStrategy(
	{
		jwtFromRequest: cookieExtractorSession,
		secretOrKey: config.secretKey,
	},
	(jwtPayload, done) => {
		const { expiration } = jwtPayload;

		if (Date.now() > expiration) {
			done("Unauthorized", false);
		}

		done(null, jwtPayload);
	}
);

const jwtSocialAuth = new JWTStrategy(
	{
		jwtFromRequest: cookieExtractorSocialAuth,
		secretOrKey: config.secretKey,
	},
	(jwtPayload, done) => {
		const { expiration } = jwtPayload;

		if (Date.now() > expiration) {
			done("Unauthorized", false);
		}

		done(null, jwtPayload);
	}
);

passport.use("jwt", jwtSession);
passport.use("jwtSocialAuth", jwtSocialAuth);

passport.use("google", google);
passport.use("github", github);

passport.serializeUser((user: any, done) => {
	done(null, user.profile);
});

passport.deserializeUser((user: number, done) => {
	User.findByPk(user)
		.then((user: UserAttributes | null) => {
			done(null, user);
		})
		.catch((err: Error) => {
			done(err, null);
		});
});

export default passport;
