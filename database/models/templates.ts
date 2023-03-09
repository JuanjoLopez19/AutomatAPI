import db from "../database";
import { DataTypes, ENUM, Model, Optional } from "sequelize";

export enum techType {
	"services" = "services",
	"app_web" = "app_web",
}

export enum technology {
	"flask" = "flask",
	"django" = "django",
	"express" = "express",
}

export interface TemplateAttributes {
	id: number;
	user_id: number;
	app_name: string;
	date_created: Date;
	tech_type: techType;
	technology: technology;
	template_ref: string;
}

export interface TemplateInput extends Optional<TemplateAttributes, "id"> {}
export interface TemplateOuput extends Required<TemplateAttributes> {}

class Templates
	extends Model<TemplateAttributes, TemplateInput>
	implements TemplateAttributes
{
	public id!: number;
	public user_id!: number;
	public app_name!: string;
	public date_created!: Date;
	public tech_type!: techType;
	public technology!: technology;
	public template_ref!: string;
}

Templates.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    app_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    date_created: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tech_type: {
        type: DataTypes.ENUM("services", "app_web"),
        allowNull: false,
    },
    technology: {
        type: DataTypes.ENUM("flask", "django", "express"),
        allowNull: false,
    },
    template_ref: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
}, {
    sequelize: db,
    tableName: "templates",
});


export default Templates;