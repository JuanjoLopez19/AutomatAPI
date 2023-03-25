import dotenv from "dotenv";
dotenv.config();

const config = {
	port: process.env.PORT || "3000",
	secretKey: process.env.SECRET_KEY || "secretKey",
	saltRounds: Number(process.env.SALT_ROUNDS) || 10,
	expiration: Number(process.env.EXPIRATION_TIME) || 180,
	db: {
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || "5432",
		username: process.env.DB_USERNAME || "postgres",
		password: process.env.DB_PASSWORD || "postgres",
		database: process.env.DB_DATABASE || "postgres",
		dialect: process.env.DB_DIALECT || "postgres",
	},
	backend_url: process.env.BACKEND_URL || "http://localhost:5000",
	smtp:{
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: Number(process.env.SMTP_PORT) || 587,
		email: process.env.SMTP_EMAIL || "email",
		password: process.env.SMTP_PWD || "password",
	},
	front: process.env.FRONTEND_HOST || "http://localhost:4200",
	host: process.env.HOST || "http://localhost:3000",
	activateRoute: process.env.ACTIVATION_ROUTE || "/activate",
	resetRoute: process.env.RESET_ROUTE || "/reset",
};

export default config;
