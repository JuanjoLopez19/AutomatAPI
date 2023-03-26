import passportGithub from "passport-github2";
const githubStrategy = passportGithub.Strategy;
import config from "../../config/config";

const github = new githubStrategy(
	{
		clientID: config.github.clientID,
		clientSecret: config.github.clientSecret,
		callbackURL: `http://localhost:${config.port}${config.github.callbackURL}`,
		passReqToCallback: true,
	},
	async (
		request: any,
		accessToken: string,
		refreshToken: string,
		profile:passportGithub.Profile,
		done: any
	) => {
		console.log("Github profile", profile);
		return done(null, profile); //Change this to the correct function
	}
);

export default github;
