import { Sequelize, Dialect } from "sequelize";
import config from "../config/config";

const dbName = config.db.database || "test";
const dbUser = config.db.username || "test";
const dbPass = config.db.password || "test";
const dbDialect: Dialect =
	(config.db.dialect as Dialect) || ("mysql" as Dialect);
const dbHost = config.db.host || "localhost";
const dbPort = config.db.port || "5432";

const db = new Sequelize(dbName, dbUser, dbPass, {
	host: dbHost,
	dialect: dbDialect,
	port: parseInt(dbPort),
	logging: false,
	define: {
		timestamps: false
	},
}, );


async function testConnection() {
	try {
		//alter = true updates the database if schema has changed
		await db.sync();
		await db.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}

testConnection();

export default db;
