import passportGithub from "passport-github2";
import config from "../../config/config";
import bcrypt from "bcrypt";
import { Op, WhereOptions } from "sequelize";
import User, { role } from "../../database/models/user";
import { generateToken } from "../auxiliaryFunctions";
import jwt from "jsonwebtoken";

const githubStrategy = passportGithub.Strategy;
const github = new githubStrategy(
	{
		clientID: config.github.clientID,
		clientSecret: config.github.clientSecret,
		callbackURL: `http://localhost:${config.port}${config.github.callbackURL}`,
	},
	async (
		accessToken: string,
		refreshToken: string,
		profile: passportGithub.Profile,
		done: any
	) => {
		console.log(profile);
		try {
			const githubId = profile.id;
			const githubIdHashed = await bcrypt.hash(githubId, config.saltRounds);
			User.findAll({
				where: {
					github_id: {
						[Op.ne]: null,
					},
				} as WhereOptions<User>,
			})
				.then((users: User[]) => {
					let notFound = true;
					let registeredUser: User | undefined;
					if (users) {
						for (let i: number = 0; i < users.length; i++) {
							const githubIdHashedDB = users[i].github_id;
							const idMatched = bcrypt.compareSync(githubId, githubIdHashedDB);
							if (idMatched) {
								notFound = false;
								registeredUser = users[i];
								break;
							}
						}
					}
					if (notFound) {
						const newUser = new User();
						newUser.github_id = githubIdHashed;
						newUser.username = "";
						newUser.email = "";
						newUser.role = role.client;
						newUser.date = new Date();
						newUser.firstName = profile.displayName || "";
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
										{
											expiresIn: "60s",
										}
									);
									return done(null, {
										profile: profile,
										token: token,
										refreshToken: refreshToken,
									});
								}
							})
							.catch((err: Error) => {
								console.log(err);
								return done(err, null);
							});
					} else {
						let token = undefined;
						if (registeredUser?.activeUser) {
							token = jwt.sign({ id: registeredUser.id }, config.secretKey, {
								expiresIn: "60s",
							});
						}
						return done(null, {
							profile: profile,
							token: token,
							refreshToken: refreshToken,
						});
					}
				})
				.catch((err: Error) => {
					console.log(err);
					return done(err, null);
				});
		} catch (err) {
			console.log(err);
			return done(err, null);
		}
	}
);

export default github;
