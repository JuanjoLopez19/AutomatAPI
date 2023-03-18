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
		database: process.env.DB_NAME || "postgres",
		dialect: process.env.DB_DIALECT || "postgres",
	},
	backend_url: process.env.BACKEND_URL || "http://localhost:5000",
};

export default config;
