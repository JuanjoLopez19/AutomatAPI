import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { endpointRegex, hostRegex } from 'src/app/common/constants';
import {
  techUse,
  configFileTypes,
  dataBaseTypes,
  viewEngines,
  cssEngines,
} from 'src/app/common/enums/enums';
import {
  expressController,
  expressEndpointTemplate,
  expressServices,
  expressWebApp,
} from 'src/app/common/interfaces/expressTemplates';
import { flaskEndpointTemplate } from 'src/app/common/interfaces/flaskTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-express-templates',
  templateUrl: './express-templates.component.html',
  styleUrls: ['./express-templates.component.scss'],
})
export class ExpressTemplatesComponent {
  @ViewChild('stepper') stepper: MatStepper;

  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();

  showDialog: boolean = false;
  editMode: boolean = false;

  flaskServicesData!: expressServices;
  flaskWebAppData!: expressWebApp;

  private technology: string = 'express';
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
      tech_type: new FormControl('app_web', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
    });
    this.apiConfigFormGroup = new FormGroup({
      cors: new FormControl('no', {
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
        db_name: new FormControl('flaskDatabase'),
        db_user: new FormControl('flaskUser'),
        db_pwd: new FormControl('flaskPassword'),
        db_host: new FormControl('localhost'),
        db_port: new FormControl('0000'),
        db_type: new FormControl('sqlite'),
        table_name: new FormControl('flaskTable'),
      }),
      config_file: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      view_engine: new FormControl('', {
        updateOn: 'blur',
      }),
      css_engine: new FormControl('', {
        validators: [Validators.required],
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

  addBlueprints() {
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

  deleteBlueprint() {
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

  saveBluePrint() {
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

  checkSelection() {
    if (this.controllerSelection) return false;
    else
      return this.controllerList.find(
        (controller) => controller.name === this.controllerName
      );
  }

  createTemplate() {
    console.log(this.basicFormGroup.value);
    console.log(this.apiConfigFormGroup.value);
    console.log(this.controllersFormGroup.value);
    console.log(this.endpointsFormGroup.value);
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
}
