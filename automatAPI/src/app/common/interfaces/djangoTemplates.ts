import { databaseParams } from './interfaces';

export interface djangoServices {
  app_name: string;
  port: number;
  host: string;
  language_code: string;
  admin_url: string; // yes / no
  admin_url_name: string;
  web_browser: string; // yes / no
  web_browser_url: string;
  db: databaseParams;
  use_ssl: string;
  endpoints: djangoEndpointTemplate[];
  sub_apps: djangoSubAppAux;
}

export interface djangoWebApp {
  app_name: string;
  port: number;
  host: string;
  language_code: string;
  admin_url: string; // yes / no
  admin_url_name: string;
  web_browser: string; // yes / no
  web_browser_url: string;
  db: databaseParams;
  use_ssl: string;
  endpoints: djangoEndpointTemplate[];
  sub_apps: djangoSubAppAux;
}

export interface djangoEndpointTemplate {
  endpoint_name: string;
  endpoint_url: string;
  logged_in: string; // yes / no
  endpoint_comment: string;
  methods: djangoMethods;
}

interface djangoMethods {
  get_m: string;
  post: string;
  put: string;
  del: string;
}

export interface djangoSubAppServicesTemplate {
  subapp_name: string;
  middleware_name: string;
  logged_in: string;
  model: djangoModel;
  endpoint_name: string;
  methods: djangoMethods;
}
export interface djangoSubAppWebAppTemplate
  extends djangoSubAppServicesTemplate {
  model_editable: string;
}

interface djangoSubAppAux {
  apps: any[];
}

interface djangoModel {
  model_name: string;
  model_fields: djangoModelFields[];
}

interface djangoModelFields {
  name: string;
  type: string;
  null: string;
  default: string;
  blank: string;
}
