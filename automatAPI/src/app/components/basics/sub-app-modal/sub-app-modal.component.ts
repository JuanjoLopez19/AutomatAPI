import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  databaseRegEx,
  endpointRegex,
  functionNamePythonRegex,
} from 'src/app/common/constants';
import {
  djangoSubAppServicesTemplate,
  djangoSubAppWebAppTemplate,
} from 'src/app/common/interfaces/djangoTemplates';

@Component({
  selector: 'app-sub-app-modal',
  templateUrl: './sub-app-modal.component.html',
  styleUrls: ['./sub-app-modal.component.scss'],
})
export class SubAppModalComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() editMode: boolean = false;

  @Input() subAppData: djangoSubAppServicesTemplate = null;
  @Input() subAppDataApp: djangoSubAppWebAppTemplate = null;

  @Input() subAppNameList: string[] = [];
  @Input() modelsNameList: string[] = [];

  @Input() subAppType: string = '';

  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() AddSubApp: EventEmitter<djangoSubAppServicesTemplate> =
    new EventEmitter<djangoSubAppServicesTemplate>();
  @Output() EditSubApp: EventEmitter<djangoSubAppServicesTemplate> =
    new EventEmitter<djangoSubAppServicesTemplate>();

  @Output() AddSubAppWebApp: EventEmitter<djangoSubAppWebAppTemplate> =
    new EventEmitter<djangoSubAppWebAppTemplate>();
  @Output() EditSubAppWebApp: EventEmitter<djangoSubAppWebAppTemplate> =
    new EventEmitter<djangoSubAppWebAppTemplate>();

  addSubAppFormGroup: FormGroup;
  validName: boolean = false;
  duplicatedName: boolean = false;

  validModelName: boolean = false;
  duplicatedModelName: boolean = false;

  validUrl: boolean = false;

  noMethodChecked: boolean = false;

  ngOnInit(): void {
    if (!this.editMode) {
      // From endpoint_name take it to the model_name when adding the subapp
      this.addSubAppFormGroup = new FormGroup({
        subapp_name: new FormControl('', [Validators.required]),
        middleware_name: new FormControl('', [Validators.required]),
        logged_in: new FormControl('no', [Validators.required]),
        endpoint_name: new FormControl('', [Validators.required]),
        model_editable: new FormControl('no', [Validators.required]),
        methods: new FormGroup({
          get_m: new FormControl(false, [Validators.required]),
          post: new FormControl(false, [Validators.required]),
          put: new FormControl(false, [Validators.required]),
          del: new FormControl(false, [Validators.required]),
        }),
      });
    }
  }

  onShow(): void {
    this.validModelName = false;
    this.duplicatedModelName = false;
    this.validName = false;
    this.duplicatedName = false;
    this.validUrl = false;
    this.noMethodChecked = false;

    if (!this.editMode && (this.subAppData || this.subAppDataApp)) {
      if (this.subAppData) {
        this.addSubAppFormGroup = new FormGroup({
          subapp_name: new FormControl(this.subAppData.subapp_name, [
            Validators.required,
          ]),
          middleware_name: new FormControl(this.subAppData.middleware_name, [
            Validators.required,
          ]),
          logged_in: new FormControl(this.subAppData.logged_in, [
            Validators.required,
          ]),
          endpoint_name: new FormControl(this.subAppData.endpoint_name, [
            Validators.required,
          ]),
          model_editable: new FormControl('no', [Validators.required]),
          methods: new FormGroup({
            get_m: new FormControl(this.subAppData.methods.get_m, [
              Validators.required,
            ]),
            post: new FormControl(this.subAppData.methods.post, [
              Validators.required,
            ]),
            put: new FormControl(this.subAppData.methods.put, [
              Validators.required,
            ]),
            del: new FormControl(this.subAppData.methods.del, [
              Validators.required,
            ]),
          }),
        });
      } else {
        this.addSubAppFormGroup = new FormGroup({
          subapp_name: new FormControl(this.subAppDataApp.subapp_name, [
            Validators.required,
          ]),
          middleware_name: new FormControl(this.subAppDataApp.middleware_name, [
            Validators.required,
          ]),
          logged_in: new FormControl(this.subAppDataApp.logged_in, [
            Validators.required,
          ]),
          endpoint_name: new FormControl(this.subAppDataApp.endpoint_name, [
            Validators.required,
          ]),
          model_editable: new FormControl(this.subAppDataApp.model_editable, [
            Validators.required,
          ]),
          methods: new FormGroup({
            get_m: new FormControl(this.subAppDataApp.methods.get_m, [
              Validators.required,
            ]),
            post: new FormControl(this.subAppDataApp.methods.post, [
              Validators.required,
            ]),
            put: new FormControl(this.subAppDataApp.methods.put, [
              Validators.required,
            ]),
            del: new FormControl(this.subAppDataApp.methods.del, [
              Validators.required,
            ]),
          }),
        });
      }
    } else {
      this.addSubAppFormGroup = new FormGroup({
        subapp_name: new FormControl('', [Validators.required]),
        middleware_name: new FormControl('', [Validators.required]),
        logged_in: new FormControl('no', [Validators.required]),
        endpoint_name: new FormControl('', [Validators.required]),
        model_editable: new FormControl('no', [Validators.required]),
        methods: new FormGroup({
          get_m: new FormControl(false, [Validators.required]),
          post: new FormControl(false, [Validators.required]),
          put: new FormControl(false, [Validators.required]),
          del: new FormControl(false, [Validators.required]),
        }),
      });
    }
  }

  manageHide() {
    this.Hide.emit(false);
    this.show = false;
  }

  closeModal() {
    if (
      this.addSubAppFormGroup.valid &&
      this.validateNames() &&
      this.validateDuplicateNames() &&
      this.validateURL()
    ) {
      this.manageHide();
    }
  }

  validateNames(): boolean {
    console.log(this.addSubAppFormGroup.value);
    let result = false;
    result = functionNamePythonRegex.test(
      this.addSubAppFormGroup.get('subapp_name').value
    );

    if (!result) {
      this.validName = true;
    }
    result = databaseRegEx.test(
      this.addSubAppFormGroup.get('endpoint_name').value
    );

    if (!result) {
      this.validModelName = true;
    }
    return result;
  }

  validateDuplicateNames(): boolean {
    const subAppName = this.addSubAppFormGroup.get('subapp_name').value;
    const modelName = this.addSubAppFormGroup.get('endpoint_name').value;
    let result1 = false;
    let result2 = false;
    result1 = this.subAppNameList.includes(subAppName);
    if (result1 && !this.editMode) {
      this.duplicatedName = true;
      result1 = true;
    }

    result2 = this.modelsNameList.includes(modelName);
    if (result2 && !this.editMode) {
      this.duplicatedModelName = true; // Add the errors to the form
      result2 = true;
    }

    return !(result1 || result2);
  }

  validateURL(): boolean {
    const result = endpointRegex.test(
      this.addSubAppFormGroup.get('middleware_name').value
    );
    if (!result) this.validUrl = true;
    return result;
  }
}
