import dotenv from "dotenv";
dotenv.config();

const config = {
	port: process.env.PORT || "3000",
	secretKey: process.env.SECRET_KEY || "secretKey",
	sessionSecret: process.env.SECRET_SESSION || "secretSession",
	saltRounds: Number(process.env.SALT_ROUNDS) || 10,
	expiration: Number(process.env.EXPIRATION_TIME) || 180,
	db: {
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || "5432",
		username: process.env.DB_USERNAME || "postgres",
		password: process.env.DB_PASSWORD || "postgres",
		database: process.env.DB_NAME || "postgres",
		dialect: process.env.DB_DIALECT || "postgres",
	},
	backend_url: process.env.BACKEND_URL || "http://localhost:5000",
	smtp: {
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: Number(process.env.SMTP_PORT) || 587,
		email: process.env.SMTP_EMAIL || "email",
		password: process.env.SMTP_PWD || "password",
	},
	front: process.env.FRONTEND_HOST || "http://localhost:4200",
	host: process.env.HOST || "http://localhost:3000",
	laptopHost: process.env.LAPTOP_HOST || "http://localhost:3000",
	activateRoute: process.env.ACTIVATION_ROUTE || "/activate",
	resetRoute: process.env.RESET_ROUTE || "/reset",
	completeRoute: process.env.COMPLETE_ROUTE || "/complete",

	google: {
		clientID: process.env.GOOGLE_CLIENT_ID || "clientID",
		clientSecret: process.env.GOOGLE_SECRET || "secret",
		callbackURL:
			process.env.GOOGLE_CALLBACK ||
			"http://localhost:3000/auth/google/callback",
	},
	github: {
		clientID: process.env.GITHUB_CLIENT_ID || "clientID",
		clientSecret: process.env.GITHUB_SECRET || "secret",
		callbackURL:
			process.env.GITHUB_CALLBACK ||
			"http://localhost:3000/auth/github/callback",
	},
	twitter: {
		clientID: process.env.TWITTER_CLIENT_ID || "clientID",
		clientSecret: process.env.TWITTER_SECRET || "secret",
		callbackURL:
			process.env.TWITTER_CALLBACK ||
			"http://localhost:3000/auth/twitter/callback",
	},
	aws:{
		accessKey: process.env.AWS_ACCESS_KEY || "accessKey",
		secretKey: process.env.AWS_SECRET_KEY || "secretKey",
		region: process.env.AWS_REGION || "region",
		bucket: process.env.AWS_BUCKET || "bucket",
	},
	python:{
		host: process.env.PYTHON_BACKEND_HOST || "localhost",
		port: process.env.PYTHON_BACKEND_PORT || "5000",
	},
	cypher: {
		algorithm: process.env.ENC_ALGORITHM || "aes-256-abc",
		iv: process.env.IV_VECTOR || "iv",
		key: process.env.CYPHER_KEY || "key",
	}
};

export default config;
