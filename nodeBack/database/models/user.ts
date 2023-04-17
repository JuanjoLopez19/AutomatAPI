import db from "../database";
import { DataTypes, Model, Optional } from "sequelize";

export enum role {
	"admin" = "admin",
	"client" = "client",
}
export interface UserAttributes {
	id?: number;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	email: string;
	date: Date;
	role: role;
	activeUser: boolean;
	access_token: string;
	password_token: string;
	google_id?: string;
	github_id?: string;
	image?: string;
	template_count?: number;
}

export interface UserInput extends Optional<UserAttributes, "id"> {}
export interface UserOuput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
	public id!: number;
	public username!: string;
	public password!: string;
	public firstName!: string;
	public lastName!: string;
	public email!: string;
	public date!: Date;
	public role!: role;
	public activeUser!: boolean;
	public access_token!: string;
	public password_token!: string;
	public google_id!: string;
	public github_id!: string;
	public image!: string;
	public template_count!: number;
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
		firstName: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		lastName: {
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
		activeUser: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		access_token: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		password_token: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		google_id: {
			type: DataTypes.STRING(200),
			allowNull: true,
			defaultValue: null,
		},
		github_id: {
			type: DataTypes.STRING(200),
			allowNull: true,
			defaultValue: null,
		},
		image: {
			type: DataTypes.STRING(200),
			allowNull: true,
			defaultValue: null,
		},
		template_count: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		sequelize: db,
		tableName: "users",
	}
);

export default User;
