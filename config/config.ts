import dotenv from "dotenv";
dotenv.config();

const config = {
	port: process.env.PORT || "3000",
	db: {
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || "5432",
		username: process.env.DB_USERNAME || "postgres",
		password: process.env.DB_PASSWORD || "postgres",
		database: process.env.DB_NAME || "postgres",
		dialect: process.env.DB_DIALECT || "postgres",
	},
};

export default config;