import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  Input,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import {
  functionNamePythonRegex,
  hostRegex,
  endpointRegex,
} from 'src/app/common/constants';
import {
  techType,
  techUse,
  viewEngines,
  dataBaseTypes,
  cssEngines,
} from 'src/app/common/enums/enums';
import {
  expressServices,
  expressWebApp,
  expressEndpointTemplate,
  expressController,
} from 'src/app/common/interfaces/expressTemplates';
import {
  dropdownParams,
  httpResponse,
} from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';

@Component({
  selector: 'app-express-template-edit',
  templateUrl: './express-template-edit.component.html',
  styleUrls: ['./express-template-edit.component.scss'],
})
export class ExpressTemplateEditComponent {
  @ViewChild('stepper') stepper: MatStepper;

  @Input() templateId: string = null;
  @Input() userId: string = null;

  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeView: EventEmitter<string> = new EventEmitter<string>();

  showDialog: boolean = false;
  editMode: boolean = false;
  loadingSpinner: boolean = false;

  expressServiceData: expressServices = null;
  expressWebAppData: expressWebApp = null;

  private technology: techType = techType.express;
  techUseVar: techUse = techUse.services;

  createTemp: string = 'no';
  isLinear: boolean = true;
  useControllers: boolean = false;

  basicFormGroup: FormGroup;
  apiConfigFormGroup: FormGroup;
  controllersFormGroup: FormGroup;
  endpointsFormGroup: FormGroup;

  dropdownItems: dropdownParams[];
  dropdownItems2: dropdownParams[];
  dropdownItems3: dropdownParams[];
  dropdownItems4: dropdownParams[];

  certFileName: string = 'T_CHOSE_CERT_FILE';
  keyFileName: string = 'T_CHOSE_KEY_FILE';
  iconCertFile: string = 'pi pi-upload';
  iconKeyFile: string = 'pi pi-upload';

  endpointControllerList: expressEndpointTemplate[] = [];

  controllerList: expressController[] = [];

  endpointSelection: expressEndpointTemplate = null;
  controllerSelection: any = null;
  controllerName: string = '';

  endpointList: expressEndpointTemplate[] = [];

  invalidControllerName: boolean = false;
  duplicatedControllerName: boolean = false;

  firstStepErrors: any = {
    app_name: {
      required: false,
    },
    app_description: {},
    host: {
      required: false,
      pattern: false,
    },
    port: {
      required: false,
    },

    tech_type: {
      required: false,
    },
  };

  constructor(
    private translate: TranslateService,
    private fileDownloaderService: FileDownloaderService,
    private manageTemplates: ManageTemplatesService,
    private router: Router
  ) {
    this.translate
      .get(['T_SERVICES', 'T_APP_WEB', 'T_SELECT_ONE', 'T_BASIC_HTML'])
      .subscribe((res) => {
        this.dropdownItems = [
          {
            name: res.T_SELECT_ONE,
            value: null,
          },
          {
            name: res.T_SERVICES,
            value: techUse.services,
          },
          {
            name: res.T_APP_WEB,
            value: techUse.webApp,
          },
        ];

        this.dropdownItems2 = [
          {
            name: res.T_BASIC_HTML,
            value: '',
          },
          {
            name: viewEngines.ejs,
            value: viewEngines.ejs,
          },
          {
            name: viewEngines.pug,
            value: viewEngines.pug,
          },
          {
            name: viewEngines.hbs,
            value: viewEngines.hbs,
          },
          {
            name: viewEngines.hjs,
            value: viewEngines.hjs,
          },
          {
            name: viewEngines.jade,
            value: viewEngines.jade,
          },
          {
            name: viewEngines.twig,
            value: viewEngines.twig,
          },
          {
            name: viewEngines.vash,
            value: viewEngines.vash,
          },
        ];

        this.dropdownItems3 = [
          {
            name: res.T_SELECT_ONE,
            value: null,
          },
          {
            name: dataBaseTypes.postgres,
            value: dataBaseTypes.postgres,
          },
          {
            name: dataBaseTypes.mysql,
            value: dataBaseTypes.mysql,
          },
          {
            name: dataBaseTypes.sqlite,
            value: dataBaseTypes.sqlite,
          },
          {
            name: dataBaseTypes.oracle,
            value: dataBaseTypes.oracle,
          },
          {
            name: dataBaseTypes.mssql,
            value: dataBaseTypes.mssql,
          },
        ];

        this.dropdownItems4 = [
          {
            name: res.T_SELECT_ONE,
            value: null,
          },
          {
            name: cssEngines.css,
            value: cssEngines.css,
          },
          {
            name: cssEngines.less,
            value: cssEngines.less,
          },
          {
            name: cssEngines.sass,
            value: cssEngines.sass,
          },
          {
            name: cssEngines.scss,
            value: cssEngines.scss,
          },
          {
            name: cssEngines.styl,
            value: cssEngines.styl,
          },
        ];
      });
  }

  ngOnInit() {
    this.manageTemplates
      .getTemplateConfig(this.templateId)
      .subscribe({
        next: (data: httpResponse) => {
          console.log(data);
          this.techUseVar = data.data.tech_type;
          if (data.data.tech_type === techUse.services) {
            this.expressServiceData = data.data.template_args;
            this.expressWebAppData = null;
          } else {
            this.expressWebAppData = data.data.template_args;
            this.expressServiceData = null;
          }
          this.controllerList =
            data.data.template_args.controllers_list.list.map(
              (controller: any) => {
                return {
                  name: Object.keys(controller)[0],
                  endpoints: controller[Object.keys(controller)[0]],
                };
              }
            );

          this.endpointList = data.data.template_args.endpoints;

          this.certFileName = data.data.template_args.certs.cert_name
            ? data.data.template_args.certs.cert_name
            : 'T_CHOSE_CERT_FILE';
          this.iconCertFile = data.data.template_args.certs.cert_name
            ? 'pi pi-check'
            : 'pi pi-upload';

          this.keyFileName = data.data.template_args.certs.key_name
            ? data.data.template_args.certs.key_name
            : 'T_CHOSE_KEY_FILE';
          this.iconKeyFile = data.data.template_args.certs.key_name
            ? 'pi pi-check'
            : 'pi pi-upload';
        },
        error: (error) => {
          if (error.status === 401) this.router.navigate(['/']);
        },
      })
      .add(() => {
        this.basicFormGroup = new FormGroup({
          app_name: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.app_name
              : this.expressWebAppData.app_name,
            {
              validators: [
                Validators.required,
                Validators.pattern(functionNamePythonRegex),
                Validators.maxLength(200),
              ],
              updateOn: 'blur',
            }
          ),
          app_description: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.app_description
              : this.expressWebAppData.app_description
          ),
          port: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.port
              : this.expressWebAppData.port,
            {
              validators: [
                Validators.required,
                Validators.min(0),
                Validators.max(65535),
              ],
              updateOn: 'blur',
            }
          ),
          host: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.host
              : this.expressWebAppData.host,
            {
              validators: [Validators.required, Validators.pattern(hostRegex)],
              updateOn: 'blur',
            }
          ),
          tech_type: new FormControl(this.techUseVar, {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
        });
        this.apiConfigFormGroup = new FormGroup({
          cors: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.cors
              : this.expressWebAppData.cors,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
          strict: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.strict
              : this.expressWebAppData.strict,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
          body_parser: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.body_parser
              : this.expressWebAppData.body_parser,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
          connect_DB: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.connect_DB
              : this.expressWebAppData.connect_DB,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          use_ssl: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.use_ssl
              : this.expressWebAppData.use_ssl,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          ssl_files: new FormGroup({
            cert: new FormControl(''),
            key: new FormControl(''),
          }),
          delete_certs: new FormControl('no'),
          db: new FormGroup({
            db_name: new FormControl(
              this.expressServiceData
                ? this.expressServiceData.db.db_name
                : this.expressWebAppData.db.db_name
            ),
            db_user: new FormControl(
              this.expressServiceData
                ? this.expressServiceData.db.db_user
                : this.expressWebAppData.db.db_user
            ),
            db_pwd: new FormControl(
              this.expressServiceData
                ? this.expressServiceData.db.db_pwd
                : this.expressWebAppData.db.db_pwd
            ),
            db_host: new FormControl(
              this.expressServiceData
                ? this.expressServiceData.db.db_host
                : this.expressWebAppData.db.db_host
            ),
            db_port: new FormControl(
              this.expressServiceData
                ? this.expressServiceData.db.db_port
                : this.expressWebAppData.db.db_port
            ),
            db_type: new FormControl(
              this.expressServiceData
                ? this.expressServiceData.db.db_type
                : this.expressWebAppData.db.db_type
            ),
          }),
          config_file: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.config_file
              : this.expressWebAppData.config_file,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          view_engine: new FormControl(
            this.expressServiceData ? '' : this.expressWebAppData.view_engine,
            {
              updateOn: 'blur',
            }
          ),
          css_engine: new FormControl(
            this.expressServiceData ? '' : this.expressWebAppData.css_engine,
            {
              updateOn: 'blur',
            }
          ),
          use_controllers: new FormControl(
            this.expressServiceData
              ? this.expressServiceData.use_controllers
              : this.expressWebAppData.use_controllers,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
        });

        this.controllersFormGroup = new FormGroup({
          controllers_list: new FormGroup({
            list: new FormControl([]),
          }),
        });
        this.endpointsFormGroup = new FormGroup({
          endpoints: new FormControl([]),
        });
      });
  }

  addController() {
    // Here is where the object will be created
    this.controllersFormGroup
      .get('controllers_list')
      ?.get('list')
      .setValue(this.controllerList);
  }

  addEndpoints() {
    // Here is where the object will be created
    this.endpointsFormGroup.get('endpoints')?.setValue(this.endpointList);
  }

  nextStep() {
    this.useControllers =
      this.apiConfigFormGroup.get('use_controllers')?.value === 'yes';
    setTimeout(() => {
      this.stepper.next();
    }, 500);
  }

  onFileChange(event: any, type: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const splitFileName = file.name.split('.');
      if (
        splitFileName[splitFileName.length - 1] !== 'pem' &&
        splitFileName[splitFileName.length - 1] !== 'crt'
      ) {
        this.apiConfigFormGroup.get('ssl_files')?.get(type)?.setValue('');
        if (type === 'cert') {
          this.certFileName = 'error.T_FILE_INVALID';
          this.iconCertFile = 'pi pi-times';
        } else {
          this.keyFileName = 'error.T_FILE_INVALID';
          this.iconKeyFile = 'pi pi-times';
        }
      } else {
        this.apiConfigFormGroup.get('ssl_files')?.get(type)?.setValue(file);
        if (type === 'cert') {
          this.certFileName = file.name;
          if (this.certFileName.length > 20)
            this.certFileName = this.certFileName.substring(0, 15) + '...';
          this.iconCertFile = 'pi pi-check';
        } else {
          this.keyFileName = file.name;
          if (this.keyFileName.length > 20)
            this.keyFileName = this.keyFileName.substring(0, 15) + '...';
          this.iconKeyFile = 'pi pi-check';
        }
      }
    }
  }

  onHide() {
    this.showDialog = false;
  }

  onEndpointAdded(event: expressEndpointTemplate, type: boolean = false) {
    if (type) this.endpointList.push(event);
    else this.endpointControllerList.push(event);
  }

  onEndpointEdited(event: expressEndpointTemplate, type: boolean = false) {
    if (type) {
      this.endpointList = this.endpointList.map((endpoint) => {
        if (endpoint.endpoint_name === event.endpoint_name) {
          return event;
        }
        return endpoint;
      });
    } else {
      this.endpointControllerList = this.endpointControllerList.map(
        (endpoint) => {
          if (endpoint.endpoint_name === event.endpoint_name) {
            return event;
          }
          return endpoint;
        }
      );
    }
    this.endpointSelection = null;
  }

  deleteEndpoint(type: boolean = false) {
    if (type) {
      this.endpointList = this.endpointList.filter(
        (endpoint) => endpoint !== this.endpointSelection
      );
    } else {
      this.endpointControllerList = this.endpointControllerList.filter(
        (endpoint) => endpoint !== this.endpointSelection
      );
    }
    this.endpointSelection = null;
  }

  deleteController() {
    this.controllerList = this.controllerList.filter(
      (controller) => controller !== this.controllerSelection
    );
    this.controllerSelection = null;
    this.controllerName = '';
    this.endpointControllerList = [];
  }

  openDialog(editMode: boolean) {
    this.closeSidenav.emit();
    this.editMode = editMode;
    this.showDialog = true;
  }

  saveController() {
    if (this.checkSelection()) {
      this.duplicatedControllerName = true;
    } else if (
      this.controllerName === '' ||
      !endpointRegex.test(this.controllerName)
    ) {
      this.invalidControllerName = true;
    } else {
      if (this.controllerSelection === null) {
        this.controllerList.push({
          name: this.controllerName,
          endpoints: [...this.endpointControllerList],
        });
      } else {
        this.controllerList = this.controllerList.map((controller) => {
          if (controller === this.controllerSelection) {
            return {
              name: this.controllerName,
              endpoints: [...this.endpointControllerList],
            };
          }
          return controller;
        });
      }

      this.controllerName = '';
      this.controllerSelection = null;
      this.endpointControllerList = [];
      this.invalidControllerName = false;
      this.duplicatedControllerName = false;
    }
  }

  onControllerSelected(event: any) {
    this.endpointControllerList = event.data['endpoints'];
    this.controllerName = event.data['name'];
    this.invalidControllerName = false;
    this.duplicatedControllerName = false;
  }

  getEndpointNameList(type: boolean = false) {
    if (type)
      return this.endpointList.map((endpoint) => endpoint.endpoint_name);
    else
      return this.endpointControllerList.map(
        (endpoint) => endpoint.endpoint_name
      );
  }

  getEndpointUrlList(type: boolean = false) {
    if (type)
      return this.endpointList.map((endpoint) =>
        endpoint.endpoint_url.split('/').pop()
      );
    else
      return this.endpointControllerList.map((endpoint) =>
        endpoint.endpoint_url.split('/').pop()
      );
  }

  checkSelection() {
    if (this.controllerSelection) return false;
    else
      return this.controllerList.find(
        (controller) => controller.name === this.controllerName
      );
  }

  createTemplate() {
    this.loadingSpinner = true;
    if (this.basicFormGroup.get('tech_type')?.value === 'services') {
      this.expressServiceData = {
        app_name: this.basicFormGroup.get('app_name')?.value,
        app_description: this.basicFormGroup.get('app_description')?.value,
        host: this.basicFormGroup.get('host')?.value,
        port: this.basicFormGroup.get('port')?.value,

        strict: this.apiConfigFormGroup.get('strict')?.value,
        cors: this.apiConfigFormGroup.get('cors')?.value,
        body_parser: this.apiConfigFormGroup.get('body_parser')?.value,
        use_ssl: this.apiConfigFormGroup.get('use_ssl')?.value,
        certs: {
          cert_name: this.apiConfigFormGroup.get('ssl_files')?.get('cert').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('cert')?.value[
                'name'
              ]
            : this.certFileName !== 'T_CHOSE_CERT_FILE'
            ? this.certFileName
            : 'None',

          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
            : this.keyFileName !== 'T_CHOSE_KEY_FILE'
            ? this.keyFileName
            : 'None',
        },
        use_controllers: this.apiConfigFormGroup.get('use_controllers')?.value,
        connect_DB: this.apiConfigFormGroup.get('connect_DB')?.value,
        config_file: this.apiConfigFormGroup.get('config_file')?.value,
        db: {
          db_name: this.apiConfigFormGroup.get('db')?.get('db_name')?.value,
          db_user: this.apiConfigFormGroup.get('db')?.get('db_user')?.value,
          db_pwd: this.apiConfigFormGroup.get('db')?.get('db_pwd')?.value,
          db_host: this.apiConfigFormGroup.get('db')?.get('db_host')?.value,
          db_port: this.apiConfigFormGroup.get('db')?.get('db_port')?.value,
          db_type: this.apiConfigFormGroup.get('db')?.get('db_type')?.value,
        },

        controllers_list: {
          list: this.mapControllers(
            this.controllersFormGroup.get('controllers_list')?.get('list')
              ?.value
          ),
        },
        endpoints: [...this.endpointList],
      };

      this.manageTemplates
        .editTemplate(
          this.templateId,
          this.expressServiceData,
          techUse.webApp,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value,
          this.apiConfigFormGroup.get('delete_certs').value
        )
        .subscribe({
          next: (data: any) => {
            if (this.createTemp === 'yes') {
              this.fileDownloaderService.downloadFile(
                data.data,
                this.expressServiceData.app_name
              );
              setTimeout(() => {
                this.loadingSpinner = false;
                this.changeView.emit('home');
              }, 1500);
            } else {
              alert('updated');
              setTimeout(() => {
                this.loadingSpinner = false;
                this.changeView.emit('home');
              }, 1500);
            }
          },
          error: (error) => {
            if (error.status === 401) {
              this.router.navigate(['/']);
            }
          },
        });
    } else if (this.basicFormGroup.get('tech_type')?.value === 'app_web') {
      this.expressWebAppData = {
        app_name: this.basicFormGroup.get('app_name')?.value,
        app_description: this.basicFormGroup.get('app_description')?.value,
        host: this.basicFormGroup.get('host')?.value,
        port: this.basicFormGroup.get('port')?.value,

        strict: this.apiConfigFormGroup.get('strict')?.value,
        cors: this.apiConfigFormGroup.get('cors')?.value,
        body_parser: this.apiConfigFormGroup.get('body_parser')?.value,
        use_ssl: this.apiConfigFormGroup.get('use_ssl')?.value,
        certs: {
          cert_name: this.apiConfigFormGroup.get('ssl_files')?.get('cert').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('cert')?.value[
                'name'
              ]
            : this.certFileName !== 'T_CHOSE_CERT_FILE'
            ? this.certFileName
            : 'None',

          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
            : this.keyFileName !== 'T_CHOSE_KEY_FILE'
            ? this.keyFileName
            : 'None',
        },
        use_controllers: this.apiConfigFormGroup.get('use_controllers')?.value,
        connect_DB: this.apiConfigFormGroup.get('connect_DB')?.value,
        config_file: this.apiConfigFormGroup.get('config_file')?.value,
        view_engine: this.apiConfigFormGroup.get('view_engine')?.value,
        css_engine: this.apiConfigFormGroup.get('css_engine')?.value,
        db: {
          db_name: this.apiConfigFormGroup.get('db')?.get('db_name')?.value,
          db_user: this.apiConfigFormGroup.get('db')?.get('db_user')?.value,
          db_pwd: this.apiConfigFormGroup.get('db')?.get('db_pwd')?.value,
          db_host: this.apiConfigFormGroup.get('db')?.get('db_host')?.value,
          db_port: this.apiConfigFormGroup.get('db')?.get('db_port')?.value,
          db_type: this.apiConfigFormGroup.get('db')?.get('db_type')?.value,
        },

        controllers_list: {
          list: this.mapControllers(
            this.controllersFormGroup.get('controllers_list')?.get('list')
              ?.value
          ),
        },
        endpoints: [...this.endpointList],
      };

      this.manageTemplates
        .editTemplate(
          this.templateId,
          this.expressWebAppData,
          techUse.webApp,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value,
          this.apiConfigFormGroup.get('delete_certs').value
        )
        .subscribe({
          next: (data: any) => {
            if (this.createTemp === 'yes') {
              this.fileDownloaderService.downloadFile(
                data.data,
                this.expressWebAppData.app_name
              );
              setTimeout(() => {
                this.loadingSpinner = false;
                this.changeView.emit('home');
              }, 1500);
            } else {
              alert('updated');
              setTimeout(() => {
                this.loadingSpinner = false;
                this.changeView.emit('home');
              }, 1500);
            }
          },
          error: (error) => {
            if (error.status === 401) {
              this.router.navigate(['/']);
            }
          },
        });
    }
  }

  manageFirstStep() {
    const basicForm = this.basicFormGroup.controls;
    const keys = Object.keys(basicForm);
    keys.forEach((key) => {
      if (basicForm[key]?.errors?.['required']) {
        this.firstStepErrors[key]['required'] = true;
      } else this.firstStepErrors[key]['required'] = false;
      if (basicForm[key]?.errors?.['pattern']) {
        this.firstStepErrors[key]['pattern'] = true;
      } else this.firstStepErrors[key]['pattern'] = false;
    });
  }

  mapControllers(controllers: expressController[]) {
    if (controllers === undefined || controllers.length === 0)
      return controllers;
    const aux: any = controllers.reduce((result: any, { name, endpoints }) => {
      result[name] = endpoints;
      return result;
    }, {}) as Object;

    const aux2: any[] = [];
    for (let key in aux) {
      let obj = { [key]: aux[key] };
      aux2.push(obj);
    }

    return aux2;
  }
}
