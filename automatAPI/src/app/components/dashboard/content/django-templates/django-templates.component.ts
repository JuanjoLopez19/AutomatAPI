import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DjangoTemplatesService } from 'src/app/api/templates/django/django-templates.service';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import { hostRegex } from 'src/app/common/constants';
import {
  techUse,
  dataBaseTypes,
  LanguageNames,
  LanguageNamesSpanish,
  techType,
} from 'src/app/common/enums/enums';
import {
  djangoEndpointTemplate,
  djangoModelFields,
  djangoServices,
  djangoSubAppServicesTemplate,
  djangoSubAppWebAppTemplate,
  djangoWebApp,
} from 'src/app/common/interfaces/djangoTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-django-templates',
  templateUrl: './django-templates.component.html',
  styleUrls: ['./django-templates.component.scss'],
})
export class DjangoTemplatesComponent implements OnInit {
  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  readonly techUse: typeof techUse = techUse;
  readonly technology: techType = techType.django;
  techType: techUse = techUse.services;

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

  showModelModal: boolean = false;
  editModeModel: boolean = false;

  showSubAppModal: boolean = false;
  editModeSubApp: boolean = false;

  showDialog: boolean = false;
  editMode: boolean = false;

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
    this.basicFormGroup = new FormGroup({
      app_name: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      app_description: new FormControl(''),
      port: new FormControl('5000', {
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
      language_code: new FormControl(window.navigator.language, {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
    });

    this.apiConfigFormGroup = new FormGroup({
      admin_url: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      admin_url_name: new FormControl('admin', {}),
      web_browser: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      web_browser_url: new FormControl('browser', {}),
      connect_DB: new FormControl('no', {
        updateOn: 'change',
      }),
      db: new FormGroup({
        db_name: new FormControl('djangoDatabase'),
        db_user: new FormControl('djangoUser'),
        db_pwd: new FormControl('djangoPassword'),
        db_host: new FormControl('localhost'),
        db_port: new FormControl('1234'),
        db_type: new FormControl('sqlite'),
        table_name: new FormControl('djangoTable'),
      }),
      use_ssl: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      ssl_files: new FormGroup({
        cert: new FormControl(''),
        key: new FormControl(''),
      }),
    });

    this.subAppsFormGroup = new FormGroup({
      sub_apps: new FormGroup({
        apps: new FormControl([]),
      }),
    });

    this.endpointsFormGroup = new FormGroup({
      endpoints: new FormControl([]),
    });
  }

  manageFirstStep() {
    const basicForm = this.basicFormGroup.controls;
    const keys = Object.keys(basicForm);

    keys.forEach((key) => {
      if (basicForm[key]?.errors?.['required']) {
        this.firstStepErrors[key]['required'] = true;
      } else this.firstStepErrors[key]['required'] = false;
      if (basicForm![key]?.errors?.['pattern']) {
        this.firstStepErrors[key]['pattern'] = true;
      } else this.firstStepErrors[key]['pattern'] = false;
    });
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

  onFileChange(event: any, type: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.apiConfigFormGroup.get('ssl_files')?.get(type)?.setValue(file);
      if (type === 'cert') {
        this.certFileName = file.name;
        if (this.certFileName.length > 20)
          this.certFileName = this.certFileName.substring(0, 15) + '...';
      } else {
        this.keyFileName = file.name;
        if (this.keyFileName.length > 20)
          this.keyFileName = this.keyFileName.substring(0, 15) + '...';
      }
    }
  }

  getFieldNameList(): string[] {
    return this.modelFieldsList.map((field) => field.name);
  }

  onHide(type: boolean) {
    if (type) this.showModelModal = false;
    else this.showSubAppModal = false;
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
  }

  deleteEndpoint() {
    this.endpointList = this.endpointList.filter(
      (endpoint) => endpoint !== this.endpointSelection
    );

    this.endpointSelection = null;
  }

  onHideEndp() {
    this.showDialog = false;
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
  }

  createTemplate() {
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
            : 'None',
          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
            : 'None',
        },
        endpoints: [...this.endpointList],
        sub_apps: {
          apps: this.mapSubappsServices(
            this.subAppsFormGroup.get('sub_apps')?.get('apps')?.value
          ),
        },
      };

      this.djangoService
        .createTemplateAppWeb(
          this.technology,
          techUse.services,
          this.djangoServiceData,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value
        )
        .subscribe({
          next: (data: any) => {
            this.fileDownloaderService.downloadFile(
              data.data,
              this.djangoServiceData.app_name
            );
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
            : 'None',
          key_name: this.apiConfigFormGroup.get('ssl_files')?.get('key').value
            ? this.apiConfigFormGroup.get('ssl_files')?.get('key')?.value[
                'name'
              ]
            : 'None',
        },
        endpoints: [...this.endpointList],
        sub_apps: {
          apps: this.mapSubappsApp(
            this.subAppsFormGroup.get('sub_apps')?.get('apps')?.value
          ),
        },
      };

      this.djangoService
        .createTemplateAppWeb(
          this.technology,
          techUse.webApp,
          this.djangoWebAppData,
          this.apiConfigFormGroup.get('ssl_files').get('cert').value,
          this.apiConfigFormGroup.get('ssl_files').get('key').value
        )
        .subscribe({
          next: (data: any) => {
            this.fileDownloaderService.downloadFile(
              data.data,
              this.djangoWebAppData.app_name
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
