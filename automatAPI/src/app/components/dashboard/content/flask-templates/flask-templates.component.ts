import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { endpointRegex, hostRegex } from 'src/app/common/constants';
import {
  techUse,
  configFileTypes,
  dataBaseTypes,
} from 'src/app/common/enums/enums';
import {
  flaskBlueprint,
  flaskEndpointTemplate,
  flaskServices,
  flaskWebApp,
} from 'src/app/common/interfaces/flaskTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-flask-templates',
  templateUrl: './flask-templates.component.html',
  styleUrls: ['./flask-templates.component.scss'],
})
export class FlaskTemplatesComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();

  showDialog: boolean = false;
  editMode: boolean = false;

  flaskServicesData!: flaskServices;
  flaskWebAppData!: flaskWebApp;

  private technology: string = 'flask';
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
      type_config_file: new FormControl('dev', {
        updateOn: 'blur',
      }),
      use_bp: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
    });

    this.blueprintsFormGroup = new FormGroup({
      bp_list: new FormGroup({
        list: new FormControl([]),
      }),
    });
    this.endpointsFormGroup = new FormGroup({
      endpoints: new FormControl([]),
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
      this.endpointBPList = [];
      this.invalidBpName = false;
      this.duplicatedBpName = false;
    }
  }

  onBPSelected(event: any) {
    console.log(event);
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

  checkSelection() {
    if (this.bpSelection) return false;
    else return this.blueprintList.find((bp) => bp.name === this.bpName);
  }

  createTemplate() {
    console.log(this.basicFormGroup.value);
    console.log(this.apiConfigFormGroup.value);
    console.log(this.blueprintsFormGroup.value);
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
