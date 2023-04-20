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
import { Router } from '@angular/router';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import { FlaskTemplatesService } from 'src/app/api/templates/flask/flask-templates.service';
import {
  functionNamePythonRegex,
  hostRegex,
  endpointRegex,
} from 'src/app/common/constants';
import {
  techType,
  techUse,
  configFileTypes,
  dataBaseTypes,
} from 'src/app/common/enums/enums';
import {
  flaskServices,
  flaskWebApp,
  flaskEndpointTemplate,
  flaskBlueprint,
} from 'src/app/common/interfaces/flaskTemplates';
import {
  dropdownParams,
  httpResponse,
} from 'src/app/common/interfaces/interfaces';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';

@Component({
  selector: 'app-flask-template-edit',
  templateUrl: './flask-template-edit.component.html',
  styleUrls: ['./flask-template-edit.component.scss'],
})
export class FlaskTemplateEditComponent {
  @ViewChild('stepper') stepper: MatStepper;

  @Input() templateId: string = null;
  @Input() userId: string = null;
  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();

  showDialog: boolean = false;
  editMode: boolean = false;

  flaskServicesData: flaskServices = null;
  flaskWebAppData: flaskWebApp = null;

  private technology: techType = techType.flask;
  techUseVar: techUse = techUse.services;
  isLinear: boolean = true;
  useBlueprints: boolean = false;
  basicFormGroup: FormGroup;
  apiConfigFormGroup: FormGroup;
  blueprintsFormGroup: FormGroup;
  endpointsFormGroup: FormGroup;

  dropdownItems: dropdownParams[];
  dropdownItems2: dropdownParams[];
  dropdownItems3: dropdownParams[];

  certFileName: string = 'T_CHOSE_CERT_FILE';
  keyFileName: string = 'T_CHOSE_KEY_FILE';
  iconCertFile: string = 'pi pi-upload';
  iconKeyFile: string = 'pi pi-upload';

  endpointBPList: flaskEndpointTemplate[] = [];

  blueprintList: flaskBlueprint[] = [];

  endpointSelection: flaskEndpointTemplate = null;
  bpSelection: any = null;
  bpName: string = '';

  endpointList: flaskEndpointTemplate[] = [];

  invalidBpName: boolean = false;
  duplicatedBpName: boolean = false;

  firstStepErrors: any = {
    app_name: {
      required: false,
      pattern: false,
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
    private flaskService: FlaskTemplatesService,
    private manageTemplates: ManageTemplatesService,
    private router: Router
  ) {
    this.translate
      .get(['T_SERVICES', 'T_APP_WEB', 'T_SELECT_ONE', 'T_DEV', 'T_PROD'])
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
            name: res.T_SELECT_ONE,
            value: null,
          },
          {
            name: res.T_DEV,
            value: configFileTypes.dev,
          },
          {
            name: res.T_PROD,
            value: configFileTypes.prod,
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
            this.flaskServicesData = data.data.template_args;
            this.flaskWebAppData = null;
          } else {
            this.flaskWebAppData = data.data.template_args;
            this.flaskServicesData = null;
            this.blueprintList = data.data.template_args.bp_list.list.map(
              (bp: any) => {
                return {
                  name: Object.keys(bp)[0],
                  endpoints: bp[Object.keys(bp)[0]],
                };
              }
            );
          }
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
            this.flaskServicesData
              ? this.flaskServicesData.app_name
              : this.flaskWebAppData.app_name,
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
            this.flaskServicesData
              ? this.flaskServicesData.app_description
              : this.flaskWebAppData.app_description
          ),
          port: new FormControl(
            this.flaskServicesData
              ? this.flaskServicesData.port
              : this.flaskWebAppData.port,
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
            this.flaskServicesData
              ? this.flaskServicesData.host
              : this.flaskWebAppData.host,
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
            this.flaskServicesData
              ? this.flaskServicesData.cors
              : this.flaskWebAppData.cors,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
          connect_DB: new FormControl(
            this.flaskServicesData
              ? this.flaskServicesData.connect_DB
              : this.flaskWebAppData.connect_DB,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          use_ssl: new FormControl(
            this.flaskServicesData
              ? this.flaskServicesData.use_ssl
              : this.flaskWebAppData.use_ssl,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          ssl_files: new FormGroup({
            cert: new FormControl(''),
            key: new FormControl(''),
          }),
          db: new FormGroup({
            db_name: new FormControl(
              this.flaskServicesData
                ? this.flaskServicesData.db.db_name
                : this.flaskWebAppData.db.db_name
            ),
            db_user: new FormControl(
              this.flaskServicesData
                ? this.flaskServicesData.db.db_user
                : this.flaskWebAppData.db.db_user
            ),
            db_pwd: new FormControl(
              this.flaskServicesData
                ? this.flaskServicesData.db.db_pwd
                : this.flaskWebAppData.db.db_pwd
            ),
            db_host: new FormControl(
              this.flaskServicesData
                ? this.flaskServicesData.db.db_host
                : this.flaskWebAppData.db.db_host
            ),
            db_port: new FormControl(
              this.flaskServicesData
                ? this.flaskServicesData.db.db_port
                : this.flaskWebAppData.db.db_port
            ),
            db_type: new FormControl(
              this.flaskServicesData
                ? this.flaskServicesData.db.db_type
                : this.flaskWebAppData.db.db_type
            ),
            table_name: new FormControl(
              this.flaskServicesData
                ? this.flaskServicesData.table_name
                : this.flaskWebAppData.table_name
            ),
          }),
          config_file: new FormControl(
            this.flaskServicesData
              ? this.flaskServicesData.config_file
              : this.flaskWebAppData.config_file,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          type_config_file: new FormControl(
            this.flaskServicesData
              ? this.flaskServicesData.type_config_file
              : this.flaskWebAppData.type_config_file,
            {
              updateOn: 'blur',
            }
          ),
          use_bp: new FormControl(
            this.flaskServicesData ? 'no' : this.flaskWebAppData.use_bp,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
        });

        this.blueprintsFormGroup = new FormGroup({
          bp_list: new FormGroup({
            list: new FormControl([]),
          }),
        });
        this.endpointsFormGroup = new FormGroup({
          endpoints: new FormControl([]),
        });
      });
  }

  addBlueprints() {
    // Here is where the object will be created
    this.blueprintsFormGroup
      .get('bp_list')
      ?.get('list')
      .setValue(this.blueprintList);
  }

  addEndpoints() {
    // Here is where the object will be created
    this.endpointsFormGroup.get('endpoints')?.setValue(this.endpointList);
  }

  nextStep() {
    this.useBlueprints = this.apiConfigFormGroup.get('use_bp')?.value === 'yes';
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

  onEndpointAdded(event: flaskEndpointTemplate, type: boolean = false) {
    if (type) this.endpointList.push(event);
    else this.endpointBPList.push(event);
  }

  onEndpointEdited(event: flaskEndpointTemplate, type: boolean = false) {
    if (type) {
      this.endpointList = this.endpointList.map((endpoint) => {
        if (endpoint.endpoint_name === event.endpoint_name) {
          return event;
        }
        return endpoint;
      });
    } else {
      this.endpointBPList = this.endpointBPList.map((endpoint) => {
        if (endpoint.endpoint_name === event.endpoint_name) {
          return event;
        }
        return endpoint;
      });
    }
    this.endpointSelection = null;
  }

  deleteEndpoint(type: boolean = false) {
    if (type) {
      this.endpointList = this.endpointList.filter(
        (endpoint) => endpoint !== this.endpointSelection
      );
    } else {
      this.endpointBPList = this.endpointBPList.filter(
        (endpoint) => endpoint !== this.endpointSelection
      );
    }
    this.endpointSelection = null;
  }

  deleteBlueprint() {
    this.blueprintList = this.blueprintList.filter(
      (bp) => bp !== this.bpSelection
    );
    this.bpSelection = null;
    this.bpName = '';
    this.endpointBPList = [];
  }

  openDialog(editMode: boolean) {
    this.closeSidenav.emit();
    this.editMode = editMode;
    this.showDialog = true;
  }

  saveBluePrint() {
    if (this.checkSelection()) {
      this.duplicatedBpName = true;
    } else if (this.bpName === '' || !endpointRegex.test(this.bpName)) {
      this.invalidBpName = true;
    } else {
      if (this.bpSelection === null) {
        this.blueprintList.push({
          name: this.bpName,
          endpoints: [...this.endpointBPList],
        });
      } else {
        this.blueprintList = this.blueprintList.map((bp) => {
          if (bp === this.bpSelection) {
            return {
              name: this.bpName,
              endpoints: [...this.endpointBPList],
            };
          }
          return bp;
        });
      }

      this.bpName = '';
      this.bpSelection = null;
      this.endpointBPList = [];
      this.invalidBpName = false;
      this.duplicatedBpName = false;
    }
  }

  onBPSelected(event: any) {
    this.endpointBPList = event.data['endpoints'];
    this.bpName = event.data['name'];
    this.invalidBpName = false;
    this.duplicatedBpName = false;
  }

  getEndpointNameList(type: boolean = false) {
    if (type)
      return this.endpointList.map((endpoint) => endpoint.endpoint_name);
    else return this.endpointBPList.map((endpoint) => endpoint.endpoint_name);
  }

  getEndpointUrlList(type: boolean = false) {
    if (type)
      return this.endpointList.map((endpoint) =>
        endpoint.endpoint_url.split('/').pop()
      );
    else
      return this.endpointBPList.map((endpoint) =>
        endpoint.endpoint_url.split('/').pop()
      );
  }

  checkSelection() {
    if (this.bpSelection) return false;
    else return this.blueprintList.find((bp) => bp.name === this.bpName);
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

  createTemplate() {
    if (this.basicFormGroup.get('tech_type').value === 'services') {
      this.flaskServicesData = {
        app_name: this.basicFormGroup.get('app_name')?.value,
        app_description: this.basicFormGroup.get('app_description')?.value,
        host: this.basicFormGroup.get('host')?.value,
        port: this.basicFormGroup.get('port')?.value,

        cors: this.apiConfigFormGroup.get('cors')?.value,
        config_file: this.apiConfigFormGroup.get('config_file')?.value,
        type_config_file:
          this.apiConfigFormGroup.get('type_config_file')?.value,
        connect_DB: this.apiConfigFormGroup.get('connect_DB')?.value,
        db: {
          db_name: this.apiConfigFormGroup.get('db')?.get('db_name')?.value,
          db_user: this.apiConfigFormGroup.get('db')?.get('db_user')?.value,
          db_pwd: this.apiConfigFormGroup.get('db')?.get('db_pwd')?.value,
          db_host: this.apiConfigFormGroup.get('db')?.get('db_host')?.value,
          db_port: this.apiConfigFormGroup.get('db')?.get('db_port')?.value,
          db_type: this.apiConfigFormGroup.get('db')?.get('db_type')?.value,
        },
        table_name: this.apiConfigFormGroup.get('db')?.get('table_name')?.value,
        use_ssl: this.apiConfigFormGroup.get('use_ssl')?.value,
        certs: {
          cert_name: this.apiConfigFormGroup.get('ssl_files')?.get('cert').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('cert')?.value[
                'name'
              ]
            : this.certFileName,

          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
            : this.keyFileName,
        },
        endpoints: [...this.endpointList],
      };

      console.log(this.flaskServicesData);
      this.flaskService
        .createTemplateServices(
          this.technology,
          techUse.services,
          this.flaskServicesData,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value
        )
        .subscribe({
          next: (data: any) => {
            this.fileDownloaderService.downloadFile(
              data.data,
              this.flaskServicesData.app_name
            );
          },
          error: (error) => {
            if (error.status === 401) {
              this.router.navigate(['/']);
            }
          },
        });
    } else if (this.basicFormGroup.get('tech_type').value === 'app_web') {
      this.flaskWebAppData = {
        app_name: this.basicFormGroup.get('app_name')?.value,
        app_description: this.basicFormGroup.get('app_description')?.value,
        host: this.basicFormGroup.get('host')?.value,
        port: this.basicFormGroup.get('port')?.value,

        cors: this.apiConfigFormGroup.get('cors')?.value,
        config_file: this.apiConfigFormGroup.get('config_file')?.value,
        type_config_file:
          this.apiConfigFormGroup.get('type_config_file')?.value,
        connect_DB: this.apiConfigFormGroup.get('connect_DB')?.value,
        db: {
          db_name: this.apiConfigFormGroup.get('db')?.get('db_name')?.value,
          db_user: this.apiConfigFormGroup.get('db')?.get('db_user')?.value,
          db_pwd: this.apiConfigFormGroup.get('db')?.get('db_pwd')?.value,
          db_host: this.apiConfigFormGroup.get('db')?.get('db_host')?.value,
          db_port: this.apiConfigFormGroup.get('db')?.get('db_port')?.value,
          db_type: this.apiConfigFormGroup.get('db')?.get('db_type')?.value,
        },
        table_name: this.apiConfigFormGroup.get('db')?.get('table_name')?.value,
        use_ssl: this.apiConfigFormGroup.get('use_ssl')?.value,
        certs: {
          cert_name: this.apiConfigFormGroup.get('ssl_files')?.get('cert').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('cert')?.value[
                'name'
              ]
            : this.certFileName,

          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
            : this.keyFileName,
        },
        endpoints: [...this.endpointList],

        use_bp: this.apiConfigFormGroup.get('use_bp')?.value,
        bp_list: {
          list: this.mapBPList(
            this.blueprintsFormGroup.get('bp_list')?.get('list')?.value
          ),
        },
      };

      console.log(this.flaskWebAppData);
      this.flaskService
        .createTemplateAppWeb(
          this.technology,
          techUse.webApp,
          this.flaskWebAppData,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value
        )
        .subscribe({
          next: (data: any) => {
            this.fileDownloaderService.downloadFile(
              data.data,
              this.flaskWebAppData.app_name
            );
          },
          error: (error) => {
            if (error.status === 401) {
              this.router.navigate(['/']);
            }
          },
        });
    }
  }

  mapBPList(bp: flaskBlueprint[]): any {
    const aux: any = bp.reduce((result: any, { name, endpoints }) => {
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
