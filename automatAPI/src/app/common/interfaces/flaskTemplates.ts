import { databaseParams, sslFilesInterface } from './interfaces';

export interface flaskServices {
  app_name: string;
  app_description: string;
  host: string;
  port: number;

  cors: string;
  connect_DB: string;
  use_ssl: string;
  certs: sslFilesInterface;
  db: databaseParams;
  table_name: string;
  config_file: string;
  type_config_file: string;

  endpoints: flaskEndpointTemplate[];
}

export interface flaskWebApp {
  app_name: string;
  app_description: string;
  port: number;
  host: string;

  cors: string;
  connect_DB: string;
  use_ssl: string;
  certs: sslFilesInterface;
  db: databaseParams;
  table_name: string;
  config_file: string;
  type_config_file: string;
  handle_404: string;

  use_bp: string;
  bp_list: flaskBlueprintAux;

  endpoints: flaskEndpointTemplate[];
}

export interface flaskEndpointTemplate {
  endpoint_name: string;
  endpoint_comment: string;
  endpoint_url: string;
  bp_name?: string;
  methods: flaskMethods;
}

export interface flaskMethods {
  get_m: string;
  post: string;
  put: string;
  delete: string;
}

export interface flaskBlueprintAux {
  list: any[];
}



export interface flaskBlueprint {
  name: string;
  endpoints: flaskEndpointTemplate[];
}
