import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { DjangoTemplatesService } from 'src/app/api/templates/django/django-templates.service';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import { hostRegex } from 'src/app/common/constants';
import {
  techUse,
  techType,
  dataBaseTypes,
  LanguageNames,
  LanguageNamesSpanish,
} from 'src/app/common/enums/enums';
import {
  djangoServices,
  djangoWebApp,
  djangoModelFields,
  djangoSubAppServicesTemplate,
  djangoSubAppWebAppTemplate,
  djangoEndpointTemplate,
} from 'src/app/common/interfaces/djangoTemplates';
import {
  dropdownParams,
  httpResponse,
} from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-django-template-edit',
  templateUrl: './django-template-edit.component.html',
  styleUrls: ['./django-template-edit.component.scss'],
})
export class DjangoTemplateEditComponent {
  @ViewChild('stepper') stepper: MatStepper;
  @Input() templateId: string = null;
  @Input() userId: string = null;

  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeView: EventEmitter<string> = new EventEmitter<string>();
  @Output() openSidenav: EventEmitter<void> = new EventEmitter<void>();

  readonly techUse: typeof techUse = techUse;
  readonly technology: techType = techType.django;
  techType: techUse = techUse.services;
  techUseVar: techUse = techUse.services;

  createTemp: string = 'no';
  oldCerts: boolean = false;

  djangoServiceData!: djangoServices;
  djangoWebAppData!: djangoWebApp;

  basicFormGroup: FormGroup;
  apiConfigFormGroup: FormGroup;
  subAppsFormGroup: FormGroup;
  endpointsFormGroup: FormGroup;

  dropdownItems: dropdownParams[];
  dropdownItems2: dropdownParams[];
  dropdownItems3: dropdownParams[];

  certFileName: string = 'T_CHOSE_CERT_FILE';
  keyFileName: string = 'T_CHOSE_KEY_FILE';
  iconCertFile: string = 'pi pi-upload';
  iconKeyFile: string = 'pi pi-upload';

  showModelModal: boolean = false;
  editModeModel: boolean = false;

  showSubAppModal: boolean = false;
  editModeSubApp: boolean = false;

  showDialog: boolean = false;
  editMode: boolean = false;
  loadingSpinner: boolean = false;

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
    language_code: {
      required: false,
    },
  };

  fieldSelection: djangoModelFields = null;
  modelFieldsList: djangoModelFields[] = [];

  subAppSelection: djangoSubAppServicesTemplate = null;
  subAppSelectionWebApp: djangoSubAppWebAppTemplate = null;
  subAppsList: djangoSubAppServicesTemplate[] = [];
  subAppsListWebApp: djangoSubAppWebAppTemplate[] = [];

  endpointSelection: djangoEndpointTemplate = null;
  endpointList: djangoEndpointTemplate[] = [];

  constructor(
    private translate: TranslateService,
    private djangoService: DjangoTemplatesService,
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
        this.dropdownItems3 = [
          {
            name: res.T_SELECT_ONE,
            value: null,
          },
        ];
      })
      .add(() => {
        this.mapLanguageOptions(window.navigator.language);
      });
  }

  ngOnInit(): void {
    this.manageTemplates
      .getTemplateConfig(this.templateId)
      .subscribe({
        next: (data: httpResponse) => {
          console.log(data);
          this.techUseVar = data.data.tech_type;
          if (data.data.tech_type === techUse.services) {
            this.djangoServiceData = data.data.template_args;
            this.djangoWebAppData = null;
          } else {
            this.djangoWebAppData = data.data.template_args;
            this.djangoServiceData = null;
          }
          if (this.techUseVar === techUse.services) {
            this.subAppsList = data.data.template_args.sub_apps.apps.map(
              (subapp: any) => {
                return subapp[Object.keys(subapp)[0]];
              }
            );
          } else {
            this.subAppsListWebApp = data.data.template_args.sub_apps.apps.map(
              (subapp: any) => {
                return subapp[Object.keys(subapp)[0]];
              }
            );
          }

          this.endpointList = data.data.template_args.endpoints;

          if (
            (data.data.template_args.certs.cert_name &&
              data.data.template_args.certs.cert_name !== 'None') ||
            (data.data.template_args.certs.key_name &&
              data.data.template_args.certs.key_name !== 'None')
          )
            this.oldCerts = true;
          this.certFileName =
            data.data.template_args.certs.cert_name &&
            data.data.template_args.certs.cert_name !== 'None'
              ? data.data.template_args.certs.cert_name
              : 'T_CHOSE_CERT_FILE';
          this.iconCertFile =
            data.data.template_args.certs.cert_name &&
            data.data.template_args.certs.cert_name !== 'None'
              ? 'pi pi-check'
              : 'pi pi-upload';

          this.keyFileName =
            data.data.template_args.certs.key_name &&
            data.data.template_args.certs.key_name !== 'None'
              ? data.data.template_args.certs.key_name
              : 'T_CHOSE_KEY_FILE';
          this.iconKeyFile =
            data.data.template_args.certs.key_name &&
            data.data.template_args.certs.key_name !== 'None'
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
            this.djangoServiceData
              ? this.djangoServiceData.app_name
              : this.djangoWebAppData.app_name,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
          app_description: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.app_description
              : this.djangoWebAppData.app_description
          ),
          port: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.port
              : this.djangoWebAppData.port,
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
            this.djangoServiceData
              ? this.djangoServiceData.host
              : this.djangoWebAppData.host,
            {
              validators: [Validators.required, Validators.pattern(hostRegex)],
              updateOn: 'blur',
            }
          ),
          tech_type: new FormControl(this.techUseVar, {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          language_code: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.language_code
              : this.djangoWebAppData.language_code,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
        });

        this.apiConfigFormGroup = new FormGroup({
          admin_url: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.admin_url
              : this.djangoWebAppData.admin_url,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          admin_url_name: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.admin_url_name
              : this.djangoWebAppData.admin_url_name
          ),
          web_browser: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.web_browser
              : this.djangoWebAppData.web_browser,
            {
              validators: [Validators.required],
              updateOn: 'change',
            }
          ),
          web_browser_url: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.web_browser_url
              : this.djangoWebAppData.web_browser_url,
            {}
          ),
          connect_DB: new FormControl('no', {
            updateOn: 'change',
          }),
          db: new FormGroup({
            db_name: new FormControl(
              this.djangoServiceData
                ? this.djangoServiceData.db.db_name
                : this.djangoWebAppData.db.db_name
            ),
            db_user: new FormControl(
              this.djangoServiceData
                ? this.djangoServiceData.db.db_user
                : this.djangoWebAppData.db.db_user
            ),
            db_pwd: new FormControl(
              this.djangoServiceData
                ? this.djangoServiceData.db.db_pwd
                : this.djangoWebAppData.db.db_pwd
            ),
            db_host: new FormControl(
              this.djangoServiceData
                ? this.djangoServiceData.db.db_host
                : this.djangoWebAppData.db.db_host
            ),
            db_port: new FormControl(
              this.djangoServiceData
                ? this.djangoServiceData.db.db_port
                : this.djangoWebAppData.db.db_port
            ),
            db_type: new FormControl(
              this.djangoServiceData
                ? this.djangoServiceData.db.db_type
                : this.djangoWebAppData.db.db_type
            ),
          }),
          use_ssl: new FormControl(
            this.djangoServiceData
              ? this.djangoServiceData.use_ssl
              : this.djangoWebAppData.use_ssl,
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
        });

        this.subAppsFormGroup = new FormGroup({
          sub_apps: new FormGroup({
            apps: new FormControl([]),
          }),
        });

        this.endpointsFormGroup = new FormGroup({
          endpoints: new FormControl([]),
        });
      });
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
      if (basicForm![key]?.errors?.['pattern']) {
        this.firstStepErrors[key]['pattern'] = true;
        pass = false;
      } else this.firstStepErrors[key]['pattern'] = false;
    });
    if (pass) this.stepper.next();
  }

  nextStep() {
    this.techType = this.basicFormGroup.get('tech_type').value;
    this.stepper.next();
  }

  mapLanguageOptions(lang: string) {
    const languageCodes = Object.keys(LanguageNames);
    if (lang === 'en') {
      const languageNames = Object.values(LanguageNames);
      languageCodes.forEach((code, index) => {
        this.dropdownItems3.push({
          name: languageNames[index],
          value: code,
        });
      });
    } else {
      const languageNames = Object.values(LanguageNamesSpanish);
      languageCodes.forEach((code, index) => {
        this.dropdownItems3.push({
          name: languageNames[index],
          value: code,
        });
      });
    }
  }

  getLanguageName(code: string) {
    if (window.navigator.language === 'en') {
      return LanguageNames[code as keyof typeof LanguageNames];
    } else {
      return LanguageNamesSpanish[code as keyof typeof LanguageNames];
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

  getFieldNameList(): string[] {
    return this.modelFieldsList.map((field) => field.name);
  }

  onHide(type: boolean) {
    if (type) this.showModelModal = false;
    else this.showSubAppModal = false;

    this.openSidenav.emit();
  }

  openModelModal(editMode: boolean) {
    this.closeSidenav.emit();
    this.editModeModel = editMode;
    this.showModelModal = true;
  }

  openSubAppModal(editMode: boolean) {
    this.closeSidenav.emit();
    this.editModeSubApp = editMode;
    this.showSubAppModal = true;
  }

  openDialog(editMode: boolean) {
    this.closeSidenav.emit();
    this.editMode = editMode;
    this.showDialog = true;
  }

  deleteModelField() {
    this.modelFieldsList = this.modelFieldsList.filter(
      (field) => field !== this.fieldSelection
    );
    this.fieldSelection = null;
  }

  onAddField(event: djangoModelFields) {
    this.modelFieldsList.push(event);
  }

  onEditField(event: djangoModelFields) {
    this.modelFieldsList = this.modelFieldsList.map((field) => {
      if (field.name === event.name) return event;
      else return field;
    });
    this.fieldSelection = null;
  }

  saveModel() {
    if (this.techType === this.techUse.services)
      this.subAppSelection.model['model_fields'] = this.modelFieldsList;
    else
      this.subAppSelectionWebApp.model['model_fields'] = this.modelFieldsList;

    this.subAppSelection = null;
    this.subAppSelectionWebApp = null;
    this.modelFieldsList = [];
  }

  deleteSubApp() {
    if (this.techType === this.techUse.services)
      this.subAppsList = this.subAppsList.filter(
        (subApp) => subApp !== this.subAppSelection
      );
    else {
      this.subAppsListWebApp = this.subAppsListWebApp.filter(
        (subApp) => subApp !== this.subAppSelectionWebApp
      );
    }
    this.subAppSelection = null;
    this.subAppSelectionWebApp = null;
    this.modelFieldsList = [];
  }

  onSubAppSelect(event: any) {
    this.modelFieldsList = event.data['model']['model_fields'];
  }

  getSubAppNameList(): string[] {
    return this.subAppsList.map((subApp) => subApp.subapp_name);
  }

  getModelsNameList(): string[] {
    return this.subAppsList.map((subApp) => subApp.model.model_name);
  }

  onAddSubApp(event: djangoSubAppServicesTemplate) {
    this.subAppsList.push(event);
  }

  onEditSubApp(event: djangoSubAppServicesTemplate) {
    this.subAppsList = this.subAppsList.map((subApp) => {
      if (subApp.subapp_name === event.subapp_name) return event;
      else return subApp;
    });
    this.subAppSelection = null;
  }

  onAddSubAppWebApp(event: djangoSubAppWebAppTemplate) {
    this.subAppsListWebApp.push(event);
  }

  onEditSubAppWebApp(event: djangoSubAppWebAppTemplate) {
    this.subAppsListWebApp = this.subAppsListWebApp.map((subApp) => {
      if (subApp.subapp_name === event.subapp_name) return event;
      else return subApp;
    });
    this.subAppSelectionWebApp = null;
  }

  addSubApps() {
    if (this.techType === this.techUse.services)
      this.subAppsFormGroup
        .get('sub_apps')
        ?.get('apps')
        ?.setValue(this.subAppsList);
    else
      this.subAppsFormGroup
        .get('sub_apps')
        ?.get('apps')
        ?.setValue(this.subAppsListWebApp);

    this.stepper.next();
  }

  deleteEndpoint() {
    this.endpointList = this.endpointList.filter(
      (endpoint) => endpoint !== this.endpointSelection
    );

    this.endpointSelection = null;
  }

  onHideEndp() {
    this.showDialog = false;

    this.openSidenav.emit();
  }

  getEndpointNameList() {
    return this.endpointList.map((endpoint) => endpoint.endpoint_name);
  }

  getEndpointUrlList() {
    return this.endpointList.map((endpoint) =>
      endpoint.endpoint_url.split('/').pop()
    );
  }

  onEndpointAdded(event: djangoEndpointTemplate, type: boolean = false) {
    this.endpointList.push(event);
  }

  onEndpointEdited(event: djangoEndpointTemplate, type: boolean = false) {
    this.endpointList = this.endpointList.map((endpoint) => {
      if (endpoint.endpoint_name === event.endpoint_name) {
        return event;
      }
      return endpoint;
    });

    this.endpointSelection = null;
  }

  addEndpoints() {
    // Here is where the object will be created
    this.endpointsFormGroup.get('endpoints')?.setValue(this.endpointList);
    this.stepper.next();
  }

  createTemplate() {
    this.loadingSpinner = true;
    if (this.techType === this.techUse.services) {
      this.djangoServiceData = {
        app_name: this.basicFormGroup.get('app_name')?.value,
        app_description: this.basicFormGroup.get('app_description')?.value,
        port: this.basicFormGroup.get('port')?.value,
        host: this.basicFormGroup.get('host')?.value,
        language_code: this.basicFormGroup.get('language_code')?.value,

        admin_url: this.apiConfigFormGroup.get('admin_url')?.value,
        admin_url_name: this.apiConfigFormGroup.get('admin_url_name')?.value,
        web_browser: this.apiConfigFormGroup.get('web_browser')?.value,
        web_browser_url: this.apiConfigFormGroup.get('web_browser_url')?.value,
        db: {
          db_name: this.apiConfigFormGroup.get('db')?.get('db_name')?.value,
          db_user: this.apiConfigFormGroup.get('db')?.get('db_user')?.value,
          db_pwd: this.apiConfigFormGroup.get('db')?.get('db_pwd')?.value,
          db_host: this.apiConfigFormGroup.get('db')?.get('db_host')?.value,
          db_port: this.apiConfigFormGroup.get('db')?.get('db_port')?.value,
          db_type: this.apiConfigFormGroup.get('db')?.get('db_type')?.value,
        },
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
        endpoints: [...this.endpointList],
        sub_apps: {
          apps: this.mapSubappsServices(
            this.subAppsFormGroup.get('sub_apps')?.get('apps')?.value
          ),
        },
      };
      this.manageTemplates
        .editTemplate(
          this.templateId,
          this.djangoServiceData,
          techUse.services,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value,
          this.apiConfigFormGroup.get('delete_certs').value
        )
        .subscribe({
          next: (data: any) => {
            if (this.createTemp === 'yes') {
              this.fileDownloaderService.downloadFile(
                data.data,
                this.djangoServiceData.app_name
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
    } else if (this.techType === this.techUse.webApp) {
      this.djangoWebAppData = {
        app_name: this.basicFormGroup.get('app_name')?.value,
        app_description: this.basicFormGroup.get('app_description')?.value,
        port: this.basicFormGroup.get('port')?.value,
        host: this.basicFormGroup.get('host')?.value,
        language_code: this.basicFormGroup.get('language_code')?.value,

        admin_url: this.apiConfigFormGroup.get('admin_url')?.value,
        admin_url_name: this.apiConfigFormGroup.get('admin_url_name')?.value,
        web_browser: this.apiConfigFormGroup.get('web_browser')?.value,
        web_browser_url: this.apiConfigFormGroup.get('web_browser_url')?.value,
        db: {
          db_name: this.apiConfigFormGroup.get('db')?.get('db_name')?.value,
          db_user: this.apiConfigFormGroup.get('db')?.get('db_user')?.value,
          db_pwd: this.apiConfigFormGroup.get('db')?.get('db_pwd')?.value,
          db_host: this.apiConfigFormGroup.get('db')?.get('db_host')?.value,
          db_port: this.apiConfigFormGroup.get('db')?.get('db_port')?.value,
          db_type: this.apiConfigFormGroup.get('db')?.get('db_type')?.value,
        },
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
        endpoints: [...this.endpointList],
        sub_apps: {
          apps: this.mapSubappsApp(
            this.subAppsFormGroup.get('sub_apps')?.get('apps')?.value
          ),
        },
      };

      this.manageTemplates
        .editTemplate(
          this.templateId,
          this.djangoWebAppData,
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
                this.djangoWebAppData.app_name
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

  mapSubappsApp(subApps: djangoSubAppWebAppTemplate[]): any[] {
    if (subApps === undefined || subApps.length === 0) {
      return subApps;
    }

    const aux: any = subApps.reduce((acc: any, curr) => {
      acc[curr.subapp_name] = {
        subapp_name: curr.subapp_name,
        middleware: curr.middleware,
        model: curr.model,
        logged_in: curr.logged_in,
        methods: curr.methods,
        model_editable: curr.model_editable,
        endpoint_name: curr.endpoint_name,
      };
      return acc;
    }, {});

    const aux2: any[] = [];
    for (let key in aux) {
      let obj = { [key]: aux[key] };
      aux2.push(obj);
    }

    return aux2;
  }

  mapSubappsServices(subApps: djangoSubAppServicesTemplate[]): any[] {
    if (subApps === undefined || subApps.length === 0) {
      return subApps;
    }

    const aux: any = subApps.reduce((acc: any, curr) => {
      acc[curr.subapp_name] = {
        subapp_name: curr.subapp_name,
        middleware: curr.middleware,
        model: curr.model,
        logged_in: curr.logged_in,
        methods: curr.methods,
        endpoint_name: curr.endpoint_name,
      };
      return acc;
    }, {});

    const aux2: any[] = [];
    for (let key in aux) {
      let obj = { [key]: aux[key] };
      aux2.push(obj);
    }

    return aux2;
  }
}
