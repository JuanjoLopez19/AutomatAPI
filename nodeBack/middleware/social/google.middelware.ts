import passportGoogle from "passport-google-oauth20";
const googleStrategy = passportGoogle.Strategy;
import config from "../../config/config";

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
		done: passportGoogle.VerifyCallback
	) => {
		console.log("Google profile", profile);
		return done(null, profile); //Change this to the correct function
	}
);

export default google;
