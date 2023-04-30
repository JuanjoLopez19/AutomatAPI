const { Sequelize } = require('sequelize');
{%- if cookiecutter.config_file  == "yes" %}
const config = require('../config');

const db = new Sequelize(config.db.database, config.db.dbUser, config.db.password, {
    host: config.db.host,
    dialect: config.db.environment,/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    port: config.db.port
});
{%- else %}
const db = new Sequelize({{cookiecutter.db.db_name}}, {{cookiecutter.db.db_user}}, {{cookiecutter.db.db_pwd}}, {
    host: {{cookiecutter.db.db_host}},
    dialect: {{cookiecutter.db.db_type}},/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    port: {{cookiecutter.db.db_port}}
});
{%- endif %}

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

module.exports = db;