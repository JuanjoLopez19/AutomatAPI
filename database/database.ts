import {Sequelize, Dialect} from 'sequelize';
const dbName = process.env.DB_NAME || 'test';
const dbUser = process.env.DB_USER || 'test';
const dbPass = process.env.DB_PASS || 'test';
const db = new Sequelize(dbName, dbUser, dbPass, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE as Dialect ,
    port: parseInt(process.env.DB_PORT || '3306'),
})

async function testConnection(){
    try {
        //alter = true updates the database if schema has changed
        await db.sync({alter:true});
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();

export default db;