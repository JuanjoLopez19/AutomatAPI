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

export interface menuItemsDef{
  label: string;
  icon: string;
  routerLink?: string;
  state?: any
}

export interface menuItems{
  [items: string]: menuItemsDef[];
}
