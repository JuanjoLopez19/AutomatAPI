import passportGoogle from "passport-google-oauth20";
const googleStrategy = passportGoogle.Strategy;
import config from "../../config/config";
import bcrypt from "bcrypt";
import User, { role } from "../../database/models/user";
import { Op, WhereOptions } from "sequelize";
import jwt from "jsonwebtoken";
import { generateToken } from "../auxiliaryFunctions";

const google = new googleStrategy(
	{
		clientID: config.google.clientID,
		clientSecret: config.google.clientSecret,
		callbackURL: `http://localhost:${config.port}${config.google.callbackURL}`,
		passReqToCallback: true,
	},
	async (
		request: any,
		accessToken: string,
		refreshToken: string,
		profile: passportGoogle.Profile,
		done: any
	) => {
		request.socialAuthSuccess = false;
		try {
			const googleId = profile.id;
			const googleIdHashed = await bcrypt.hash(googleId, config.saltRounds);
			User.findAll({
				where: {
					google_id: {
						[Op.ne]: null,
					},
				} as WhereOptions<User>,
			})
				.then((users: User[]) => {
					let notFound = true;
					let registeredUser: User | undefined;
					if (users) {
						for (let i: number = 0; i < users.length; i++) {
							const googleIdHashedDB = users[i].google_id;
							const idMatched = bcrypt.compareSync(googleId, googleIdHashedDB);
							if (idMatched) {
								notFound = false;
								registeredUser = users[i];
								break;
							}
						}
					}

					if (notFound) {
						const newUser = new User();
						newUser.google_id = googleIdHashed;
						newUser.username = "";
						newUser.email = profile.emails![0].value;
						newUser.role = role.client;
						newUser.date = new Date();
						newUser.firstName = profile?.name?.givenName || "";
						newUser.lastName = profile?.name?.familyName || "";
						newUser.password = "";
						newUser.activeUser = true;
						newUser.access_token = "";
						newUser.password_token = generateToken(100);

						newUser
							.save()
							.then((savedUser: User) => {
								if (savedUser) {
									const token = jwt.sign(
										{ id: savedUser.id },
										config.secretKey,
										{ expiresIn: "60s" }
									);
									request.socialAuthSuccess = true;
									return done(request, savedUser, { authToken: token });
								}
							})
							.catch((error: any) => {
								console.log("Error", error);
								return done(error, false);
							});
					} else {
						let token = undefined;
						if (registeredUser?.activeUser) {
							token = jwt.sign({ id: registeredUser.id }, config.secretKey, {
								expiresIn: "60s",
							});
							request.socialAuthSuccess = true;
						}
						return done(request, registeredUser, { authToken: token });
					}
				})
				.catch((error: any) => {
					console.log("Error", error);
					return done(error, false);
				});
		} catch (error: any) {
			console.log("Error", error);
			return done(error, false);
		}
	}
);

export default google;
