import bcrypt from "bcryptjs";
import passport, { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./database/models/user";

const auth: PassportStatic = passport;

auth.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		function (username, password, done) {
			return User.findOne({ where: { email: username } })
				.then((user) => {
					if (!user) {
						return done(null, false, { message: "Incorrect email!" });
					}
					return bcrypt.compare(password, user.password).then((result) => {
						if (!result) {
							return done(null, false, { message: "Incorrect password!" });
						}
						return done(null, user);
					});
				})
				.catch((err) => {
					return done(err);
				});
		}
	)
);

export default auth;
