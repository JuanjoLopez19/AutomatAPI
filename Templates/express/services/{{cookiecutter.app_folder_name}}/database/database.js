import sequilize from 'sequelize';
{%- if cookiecutter.config_file %}
import { db } from '../config';

const sequelize = new Sequelize(db.database, db.dbUser, db.password, {
    host: db.host,
    dialect: db.environment,/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    port: db.port
});
{%- else %}
const sequelize = new Sequelize({{cookiecutter.db.db_name}}, {{cookiecutter.db.db_user}}, {{cookiecutter.db.db_pwd}}, {
    host: {{cookiecutter.db.db_host}},
    dialect: {{cookiecutter.db.db_type}},/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    port: {{cookiecutter.db.db_port}}
});
{%- endif %}

async function testConnection(){
    try {
        //alter = true updates the database if schema has changed
        await sequelize.sync({alter:true});
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();

module.exports = sequelize;