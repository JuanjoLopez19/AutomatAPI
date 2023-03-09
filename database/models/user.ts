import db from "../database";
import { DataTypes, ENUM, Model, Optional } from "sequelize";

export enum role{
	"admin" = "admin",
	"client" = "client"
}
export interface UserAttributes {
	id: number;
	username: string;
	password: string;
	email: string;
	date: Date;
	role: role;
}

export interface UserInput extends Optional<UserAttributes, "id"> {}
export interface UserOuput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
	public id!: number;
	public username!: string;
	public password!: string;
	public email!: string;
	public date!: Date;
	public role!: role;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
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
			type:  DataTypes.ENUM("admin", "client"),
			allowNull: false,
			field: "role",
		},
	},
	{
		sequelize: db,
		tableName: "users",
	}
);

export default User;