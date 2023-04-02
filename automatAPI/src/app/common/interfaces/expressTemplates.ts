import { databaseParams, sslFilesInterface } from './interfaces';

export interface expressServices {
  app_name: string;
  app_description: string;
  host: string;
  port: number;
  strict: string;
  cors: string;
  body_parser: string;
  use_ssl: string;
  certs: sslFilesInterface;
  config_file: string;
  connect_DB: string;
  db: databaseParams;
  use_controllers: string;
  controllers_list: expressControllerAux;
  endpoints: expressEndpointTemplate[];
}

export interface expressWebApp {
  app_name: string;
  app_description: string;
  host: string;
  port: number;
  strict: string;
  cors: string;
  body_parser: string;
  use_ssl: string;
  certs: sslFilesInterface;
  config_file: string;
  connect_DB: string;
  db: databaseParams;
  view_engine: string;
  css_engine: string;
  use_controllers: string;
  controllers_list: expressControllerAux;
  endpoints: expressEndpointTemplate[];
}

export interface expressEndpointTemplate {
  endpoint_name: string;
  endpoint_comment: string;
  endpoint_url: string;
  handler_type?: string;
  method: string;
}

export interface expressControllerAux {
  list: any[];
}

export interface expressController {
  name: string;
  endpoints: expressEndpointTemplate[];
}
