import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  flaskServices,
  flaskWebApp,
} from 'src/app/common/interfaces/flaskTemplates';

@Component({
  selector: 'app-flask-templates',
  templateUrl: './flask-templates.component.html',
  styleUrls: ['./flask-templates.component.scss'],
})
export class FlaskTemplatesComponent {
  flaskServicesData!: flaskServices;
  flaskWebAppData!: flaskWebApp;

  private technology: string = 'flask';
  isLinear: boolean = true;
  useBlueprints: boolean = false;
  basicFormGroup: FormGroup;
  apiConfigFormGroup: FormGroup;
  blueprintsFormGroup: FormGroup;
  endpointsFormGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder) {}
  ngOnInit() {
    this.basicFormGroup = this._formBuilder.group({
      app_name: ['', Validators.required],
      app_description: [''],
      port: [
        '5000',
        Validators.required,
        Validators.min(0),
        Validators.max(65535),
      ],
      host: ['127.0.0.1', Validators.required],
      tech_type: ['', Validators.required],
    });

    this.apiConfigFormGroup = this._formBuilder.group({
      cors: ['no', Validators.required],
      connect_DB: ['no', Validators.required],
      use_ssl: ['no', Validators.required],
      ssl_files: this._formBuilder.group({
        cert: [''],
        key: [''],
      }),
      db: this._formBuilder.group({
        db_name: ['flaskDatabase'],
        db_user: ['flaskUser'],
        db_password: ['flaskPassword'],
        db_host: ['localhost'],
        db_port: ['0000'],
        db_type: ['sqlite'],
      }),
      table_name: [''],
      config_file: ['no', Validators.required],
      type_config_file: ['dev'],
      use_bp: ['no', Validators.required],
    });

    this.blueprintsFormGroup = this._formBuilder.group({
      bp_list: this._formBuilder.array([]),
    });

    this.endpointsFormGroup = this._formBuilder.group({
      endpoints: this._formBuilder.array([]),
    });
  }
  submit() {
    // Here is where the object will be created
    console.log(this.basicFormGroup.value);
  }
}
