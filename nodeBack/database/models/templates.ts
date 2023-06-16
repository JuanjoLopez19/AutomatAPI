import db from '../database'
import { DataTypes, InitOptions, Model, Optional } from 'sequelize'

export enum techType {
  'services' = 'services',
  'app_web' = 'app_web',
}

export enum technology {
  'flask' = 'flask',
  'django' = 'django',
  'express' = 'express',
}

export interface TemplateAttributes {
  id: number
  user_id: number
  app_name: string
  date_created: Date
  tech_type: techType
  technology: technology
  template_ref: string
  description?: string
  last_updated?: Date
}

export interface ReferenceAttributes {
  id: number
  template_id: number
  cert_key?: string | null
  private_key?: string | null
  template_token: string
}

export interface TemplateInput extends Optional<TemplateAttributes, 'id'> {}
export interface TemplateOuput extends Required<TemplateAttributes> {}

export interface ReferenceInput extends Optional<ReferenceAttributes, 'id'> {}
export interface ReferenceOuput extends Required<ReferenceAttributes> {}

class Templates
  extends Model<TemplateAttributes, TemplateInput>
  implements TemplateAttributes
{
  public id!: number
  public user_id!: number
  public app_name!: string
  public date_created!: Date
  public tech_type!: techType
  public technology!: technology
  public template_ref!: string
  public description?: string
  public last_updated?: Date
}

Templates.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true,
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
      type: DataTypes.ENUM('services', 'app_web'),
      allowNull: false,
      values: Object.values(techType),
    },
    technology: {
      type: DataTypes.ENUM('flask', 'django', 'express'),
      allowNull: false,
      values: Object.values(technology),
    },
    template_ref: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'templates',
  }
)

export class Tokens
  extends Model<ReferenceAttributes, ReferenceInput>
  implements ReferenceAttributes
{
  public id!: number
  public template_id!: number
  public cert_key?: string
  public private_key?: string
  public template_token!: string
}

Tokens.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cert_key: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    private_key: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    template_token: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Tokens',
  } as InitOptions
)

export default Templates
