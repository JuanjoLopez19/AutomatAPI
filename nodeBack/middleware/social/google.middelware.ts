import passportGoogle from "passport-google-oauth20";
import config from "../../config/config";
import bcrypt from "bcrypt";
import User, { role } from "../../database/models/user";
import { Op, WhereOptions } from "sequelize";
import jwt from "jsonwebtoken";
import { generateToken } from "../auxiliaryFunctions";

const googleStrategy = passportGoogle.Strategy;
const google = new googleStrategy(
	{
		clientID: config.google.clientID,
		clientSecret: config.google.clientSecret,
		callbackURL: `http://localhost:${config.port}${config.google.callbackURL}`,
		passReqToCallback: true,
	},
	async (
		req: any,
		accessToken: string,
		refreshToken: string,
		profile: passportGoogle.Profile,
		done: any
	) => {
		try {
			console.log(profile);
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
						newUser.activeUser = false;
						newUser.access_token = generateToken(100);
						newUser.password_token = generateToken(100);
						newUser.image = profile.photos![0].value;

						newUser
							.save()
							.then((savedUser: User) => {
								if (savedUser) {
									return done(null, {
										profile: savedUser.id,
										accessToken: savedUser.access_token,
									});
								}
							})
							.catch((error: any) => {
								console.log("Error", error);
								return done(error, false);
							});
					} else {
						if (registeredUser?.activeUser === false) {
							return done(null, {
								profile: registeredUser.id,
								accessToken: registeredUser.access_token,
							});
						}

						return done(null, {
							profile: registeredUser?.id,
							accessToken: null,
						});
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
