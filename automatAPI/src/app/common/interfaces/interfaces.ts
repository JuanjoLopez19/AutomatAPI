import { techType, techUse } from "../enums/enums";

export interface loginParms {
  email: string;
  password: string;
}

export interface registerParams{
  email: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  date: string;
}

export interface changePasswordParams{
  password:string;
  token:string;
}

export interface rememberPasswordParams{
  email:string;
  username:string;
}

export interface completeRegisterParams{
  email?:string;
  username:string;
  password:string;
  access_token:string;
}

export interface menuItemsDef{
  label: string;
  icon: string;
  routerLink?: string;
  state?: any
  command?: any;
}

export interface menuItems{
  items:menuItemsDef[];
}

export interface databaseParams{
  db_host: string;
  db_port: number;
  db_user: string;
  db_pwd: string;
  db_name: string;
  db_type: string;
}

export interface dropdownParams{
  name:string;
  value:string;
}
export interface sslFilesInterface {
  [key: string]: string;
}

export interface httpResponse{
  data?:any;
  message?:string;
  status?:number;
}

export interface userParams{
  username:string;
  email:string;
  name:string;
  firstName:string;
  lastName:string;
  date:string;
  image:string;
  role:string;
  id:string;
}

export interface templates{
  id:string;
  user_id:string;
  app_name:string;
  description: string;
  technology: techType;
  tech_type: techUse;
  date_created: string;
}
