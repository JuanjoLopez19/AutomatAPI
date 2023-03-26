import passportTwitter from 'passport-twitter';
import config from '../../config/config';
const twitterStrategy = passportTwitter.Strategy;

const twitter = new twitterStrategy(
    {
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callbackURL: `http://localhost:${config.port}${config.twitter.callbackURL}`,
        passReqToCallback: true,
    },
    async (
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: passportTwitter.Profile,
        done: any
    ) => {
        console.log('Twitter profile', profile);
        return done(null, profile); //Change this to the correct function
    }
);

export default twitter;