import twitterPassport from "passport-twitter";
import config from "../../config/config";
import bcrypt from "bcrypt";
import User, { role } from "../../database/models/user";
import { Op, WhereOptions } from "sequelize";
import jwt from "jsonwebtoken";
import { generateToken } from "../auxiliaryFunctions";


const twitterStrategy = twitterPassport.Strategy;
const twitter = new twitterStrategy(
	{
		consumerKey: config.twitter.clientID,
		consumerSecret: config.twitter.clientSecret,
		callbackURL: `http://localhost:${config.port}${config.twitter.callbackURL}`,
	},
	async (
		accessToken: string,
		refreshToken: string,
		profile: twitterPassport.Profile,
		done: any
	) => {
		console.log(profile);
		done(null, profile);
	}
);

export default twitter;
