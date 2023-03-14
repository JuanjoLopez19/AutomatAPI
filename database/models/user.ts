import db from "../database";
import { DataTypes, ENUM, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs";

export enum role {
	"admin" = "admin",
	"client" = "client",
}
export interface UserAttributes {
	id: number;
	username: string;
	password: string;
	email: string;
	date: Date;
	role: role;
	access_token: string;
	password_token: string;
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
	public access_token!: string;
	public password_token!: string;
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
			type: DataTypes.ENUM("admin", "client"),
			allowNull: false,
			field: "role",
		},
		access_token: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		password_token: {
			type: DataTypes.STRING(200),
			allowNull: false,
		}
	},
	{
		sequelize: db,
		tableName: "pruebas",
	}
);

User.beforeSave((user) => {
	if (user.changed("password")) {
		user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
	}
});


export default User;
