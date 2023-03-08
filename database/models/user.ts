import db from "../database";
import { DataTypes, Model, Optional } from "sequelize";

enum role{
	"admin" = "admin",
	"client" = "client"
}

interface UserAttributes {
	id: number;
	username: string;
	password: string;
	email: string;
	date: Date;
	role: role;
}

export interface UserInput extends Optional<UserAttributes, "id"> {}
export interface UserOuput extends Required<UserAttributes> {}

class user extends Model<UserAttributes, UserInput> implements UserAttributes {
	public id!: number;
	public username!: string;
	public password!: string;
	public email!: string;
	public date!: Date;
	public role!: role;
}

user.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM(...Object.values(role)),
			allowNull: false,
			field: "role",
		},
	},
	{
		sequelize: db,
		tableName: "users",
	}
);

export default user;