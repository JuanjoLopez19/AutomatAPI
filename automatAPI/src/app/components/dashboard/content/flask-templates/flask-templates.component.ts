import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { techUse, configFileTypes } from 'src/app/common/enums/enums';
import {
  flaskServices,
  flaskWebApp,
} from 'src/app/common/interfaces/flaskTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-flask-templates',
  templateUrl: './flask-templates.component.html',
  styleUrls: ['./flask-templates.component.scss'],
})
export class FlaskTemplatesComponent {
  @ViewChild('stepper') stepper: MatStepper;

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
        validators: [Validators.required],
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
        updateOn: 'blur',
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
        db_password: new FormControl('flaskPassword'),
        db_host: new FormControl('localhost'),
        db_port: new FormControl('0000'),
        db_type: new FormControl('sqlite'),
      }),
      table_name: new FormControl(''),
      config_file: new FormControl('no', {
        validators: [Validators.required],
        updateOn: 'blur',
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
      bp_list: new FormArray([]),
    });
    this.endpointsFormGroup = new FormGroup({
      endpoints: new FormArray([]),
    });
  }
  submit() {
    // Here is where the object will be created
    console.log(this.apiConfigFormGroup.value);


  }
}
