import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { hostRegex } from 'src/app/common/constants';
import {
  techUse,
  dataBaseTypes,
  languageCodes,
  LanguageNames,
  LanguageNamesSpanish,
} from 'src/app/common/enums/enums';
import {
  djangoModelFields,
  djangoSubAppServicesTemplate,
  djangoSubAppWebAppTemplate,
} from 'src/app/common/interfaces/djangoTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-django-templates',
  templateUrl: './django-templates.component.html',
  styleUrls: ['./django-templates.component.scss'],
})
export class DjangoTemplatesComponent implements OnInit {
  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();

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
    lang: {
      required: false,
    },
  };

  fieldSelection: djangoModelFields = null;
  modelFieldsList: djangoModelFields[] = [];

  subAppSelection: djangoSubAppServicesTemplate = null;
  subAppSelectionWebApp: djangoSubAppWebAppTemplate = null;
  subAppsList: djangoSubAppServicesTemplate[] = [
    {
      subapp_name: 'subapp1',
      middleware_name: 'middleware1',
      logged_in: 'yes',
      model: {
        model_name: 'model1',
        model_fields: [
          {
            name: 'id',
            type: 'int',
            null: 'no',
            blank: 'no',
            default: 'auto',
          },
        ],
      },
      endpoint_name: 'model1',
      methods: {
        get_m: 'yes',
        post: 'yes',
        put: 'yes',
        del: 'yes',
      },
    },
  ];
  constructor(private translate: TranslateService) {
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
      if (basicForm[key]?.errors?.['pattern']) {
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
    this.subAppSelection.model['model_fields'] = this.modelFieldsList;

    this.subAppSelection = null;
    this.modelFieldsList = [];
  }

  deleteSubApp() {
    this.subAppsList = this.subAppsList.filter(
      (subApp) => subApp !== this.subAppSelection
    );
    this.subAppSelection = null;
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

  onAddSubApp(event: djangoSubAppServicesTemplate) {}
  onEditSubApp(event: djangoSubAppServicesTemplate) {}
  onAddSubAppWebApp(event: djangoSubAppWebAppTemplate) {}
  onEditSubAppWebApp(event: djangoSubAppWebAppTemplate) {}
}
