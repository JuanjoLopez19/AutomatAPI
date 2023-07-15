import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { ExpressTemplatesService } from 'src/app/api/templates/express/express-templates.service';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import {
  endpointRegex,
  functionNamePythonRegex,
  hostRegex,
} from 'src/app/common/constants';
import {
  techUse,
  dataBaseTypes,
  viewEngines,
  cssEngines,
  techType,
} from 'src/app/common/enums/enums';
import {
  expressController,
  expressEndpointTemplate,
  expressServices,
  expressWebApp,
} from 'src/app/common/interfaces/expressTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-express-templates',
  templateUrl: './express-templates.component.html',
  styleUrls: ['./express-templates.component.scss'],
})
export class ExpressTemplatesComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeView: EventEmitter<string> = new EventEmitter<string>();
  @Output() openSidenav: EventEmitter<void> = new EventEmitter<void>();

  showDialog = false;
  editMode = false;
  loading = false;

  expressServiceData!: expressServices;
  expressWebAppData!: expressWebApp;

  private technology: techType = techType.express;
  isLinear = true;
  useControllers = false;
  basicFormGroup: FormGroup;
  apiConfigFormGroup: FormGroup;
  controllersFormGroup: FormGroup;
  endpointsFormGroup: FormGroup;

  dropdownItems: dropdownParams[];
  dropdownItems2: dropdownParams[];
  dropdownItems3: dropdownParams[];
  dropdownItems4: dropdownParams[];

  certFileName = 'T_CHOSE_CERT_FILE';
  keyFileName = 'T_CHOSE_KEY_FILE';
  iconCertFile = 'pi pi-upload';
  iconKeyFile = 'pi pi-upload';
  errorFileCert = false;
  errorFileKey = false;

  endpointControllerList: expressEndpointTemplate[] = [];

  controllerList: expressController[] = [];

  endpointSelection: expressEndpointTemplate = null;
  controllerSelection: any = null;
  controllerName = '';

  endpointList: expressEndpointTemplate[] = [];

  invalidControllerName = false;
  duplicatedControllerName = false;

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
    private expressService: ExpressTemplatesService,
    private fileDownloaderService: FileDownloaderService,
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
          {
            name: dataBaseTypes.mariadb,
            value: dataBaseTypes.mariadb,
          },
          {
            name: dataBaseTypes.redshift,
            value: dataBaseTypes.redshift,
          },
          {
            name: dataBaseTypes.snowflake,
            value: dataBaseTypes.snowflake,
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
    this.basicFormGroup = new FormGroup({
      app_name: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(functionNamePythonRegex),
          Validators.maxLength(200),
        ],
        updateOn: 'blur',
      }),
      app_description: new FormControl(''),
      port: new FormControl('3000', {
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(65535),
        ],
        updateOn: 'blur',
      }),
      host: new FormControl('127.0.0.1', {
        validators: [Validators.required, Validators.pattern(hostRegex)],
        updateOn: 'blur',
      }),
      tech_type: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
    });
    this.apiConfigFormGroup = new FormGroup({
      cors: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      strict: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      body_parser: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      connect_DB: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      use_ssl: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      ssl_files: new FormGroup({
        cert: new FormControl(''),
        key: new FormControl(''),
      }),
      db: new FormGroup({
        db_name: new FormControl('expressDatabase'),
        db_user: new FormControl('expressUser'),
        db_pwd: new FormControl('expressPassword'),
        db_host: new FormControl('localhost'),
        db_port: new FormControl('1234'),
        db_type: new FormControl('sqlite'),
        table_name: new FormControl('expressTable'),
      }),
      config_file: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      view_engine: new FormControl('', {
        updateOn: 'blur',
      }),
      css_engine: new FormControl('', {
        updateOn: 'blur',
      }),
      use_controllers: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
    });

    this.controllersFormGroup = new FormGroup({
      controllers_list: new FormGroup({
        list: new FormControl([]),
      }),
    });
    this.endpointsFormGroup = new FormGroup({
      endpoints: new FormControl([]),
    });
  }

  addController() {
    // Here is where the object will be created
    this.controllersFormGroup
      .get('controllers_list')
      ?.get('list')
      .setValue(this.controllerList);
    this.stepper.next();
  }

  addEndpoints() {
    // Here is where the object will be created
    this.endpointsFormGroup.get('endpoints')?.setValue(this.endpointList);
    this.stepper.next();
  }

  nextStep() {
    if (!this.errorFileCert && !this.errorFileKey) {
      this.useControllers =
        this.apiConfigFormGroup.get('use_controllers')?.value === 'yes';
      setTimeout(() => {
        this.stepper.next();
      }, 500);
    }
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
          this.errorFileCert = true;
        } else {
          this.keyFileName = 'error.T_FILE_INVALID';
          this.iconKeyFile = 'pi pi-times';
          this.errorFileKey = true;
        }
      } else {
        this.apiConfigFormGroup.get('ssl_files')?.get(type)?.setValue(file);
        if (type === 'cert') {
          this.certFileName = file.name;
          if (this.certFileName.length > 20)
            this.certFileName = this.certFileName.substring(0, 15) + '...';
          this.iconCertFile = 'pi pi-check';
          this.errorFileCert = false;
        } else {
          this.keyFileName = file.name;
          if (this.keyFileName.length > 20)
            this.keyFileName = this.keyFileName.substring(0, 15) + '...';
          this.iconKeyFile = 'pi pi-check';
          this.errorFileKey = false;
        }
      }
    }
  }

  onHide() {
    this.showDialog = false;

    this.openSidenav.emit();
  }

  onEndpointAdded(event: expressEndpointTemplate, type = false) {
    if (type) this.endpointList.push(event);
    else this.endpointControllerList.push(event);
  }

  onEndpointEdited(event: expressEndpointTemplate, type = false) {
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

  deleteEndpoint(type = false) {
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

  getEndpointNameList(type = false) {
    if (type)
      return this.endpointList.map((endpoint) => endpoint.endpoint_name);
    else
      return this.endpointControllerList.map(
        (endpoint) => endpoint.endpoint_name
      );
  }

  getEndpointUrlList(type = false) {
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
    this.loading = true;
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
            : 'None',
          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
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
      performance.mark('start');
      this.expressService
        .createTemplateServices(
          this.technology,
          techUse.services,
          this.expressServiceData,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value
        )
        .subscribe({
          next: (data: any) => {
            this.fileDownloaderService.downloadFile(
              data.data,
              this.expressServiceData.app_name
            );
            performance.mark('end');
            console.log(performance.measure('start to end', 'start', 'end'));
            setTimeout(() => {
              this.loading = false;
              this.changeView.emit('home');
            }, 1500);
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
            : 'None',
          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
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
      performance.mark('start');
      this.expressService
        .createTemplateAppWeb(
          this.technology,
          techUse.webApp,
          this.expressWebAppData,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value
        )
        .subscribe({
          next: (data: any) => {
            this.fileDownloaderService.downloadFile(
              data.data,
              this.expressWebAppData.app_name
            );
            performance.mark('end');
            console.log(performance.measure('start to end', 'start', 'end'));
            setTimeout(() => {
              this.loading = false;
              this.changeView.emit('home');
            }, 1500);
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
    let pass = true;
    keys.forEach((key) => {
      if (basicForm[key]?.errors?.['required']) {
        this.firstStepErrors[key]['required'] = true;
        pass = false;
      } else this.firstStepErrors[key]['required'] = false;
      if (basicForm[key]?.errors?.['pattern']) {
        this.firstStepErrors[key]['pattern'] = true;
        pass = false;
      } else this.firstStepErrors[key]['pattern'] = false;
    });
    if (pass) this.stepper.next();
  }

  mapControllers(controllers: expressController[]) {
    if (controllers === undefined || controllers.length === 0)
      return controllers;
    const aux: any = controllers.reduce((result: any, { name, endpoints }) => {
      result[name] = endpoints;
      return result;
    }, {}) as object;

    const aux2: any[] = [];
    for (const key in aux) {
      const obj = { [key]: aux[key] };
      aux2.push(obj);
    }

    return aux2;
  }
}
