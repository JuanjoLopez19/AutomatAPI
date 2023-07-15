import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  databaseRegEx,
  endpointRegex,
  functionNamePythonRegex,
} from 'src/app/common/constants';
import { techUse } from 'src/app/common/enums/enums';
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
  @Input() show = false;
  @Input() editMode = false;

  @Input() subAppData: djangoSubAppServicesTemplate = null;
  @Input() subAppDataApp: djangoSubAppWebAppTemplate = null;

  @Input() subAppNameList: string[] = [];
  @Input() modelsNameList: string[] = [];

  @Input() subAppType = '';

  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() AddSubApp: EventEmitter<djangoSubAppServicesTemplate> =
    new EventEmitter<djangoSubAppServicesTemplate>();
  @Output() EditSubApp: EventEmitter<djangoSubAppServicesTemplate> =
    new EventEmitter<djangoSubAppServicesTemplate>();

  @Output() AddSubAppWebApp: EventEmitter<djangoSubAppWebAppTemplate> =
    new EventEmitter<djangoSubAppWebAppTemplate>();
  @Output() EditSubAppWebApp: EventEmitter<djangoSubAppWebAppTemplate> =
    new EventEmitter<djangoSubAppWebAppTemplate>();

  readonly techUse = techUse;

  addSubAppFormGroup: FormGroup;
  validName = false;
  duplicatedName = false;

  validModelName = false;
  duplicatedModelName = false;

  validUrl = false;

  noMethodChecked = false;

  ngOnInit(): void {
    if (!this.editMode) {
      // From endpoint_name take it to the model_name when adding the subapp
      this.addSubAppFormGroup = new FormGroup({
        subapp_name: new FormControl('', [Validators.required]),
        middleware: new FormControl('', [Validators.required]),
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

    if (this.editMode && (this.subAppData || this.subAppDataApp)) {
      if (this.subAppData) {
        this.addSubAppFormGroup = new FormGroup({
          subapp_name: new FormControl(this.subAppData.subapp_name, [
            Validators.required,
          ]),
          middleware: new FormControl(this.subAppData.middleware, [
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
            del: new FormControl(this.subAppData.methods.delete, [
              Validators.required,
            ]),
          }),
        });
      } else {
        this.addSubAppFormGroup = new FormGroup({
          subapp_name: new FormControl(this.subAppDataApp.subapp_name, [
            Validators.required,
          ]),
          middleware: new FormControl(this.subAppDataApp.middleware, [
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
            del: new FormControl(this.subAppDataApp.methods.delete, [
              Validators.required,
            ]),
          }),
        });
      }
    } else {
      this.addSubAppFormGroup = new FormGroup({
        subapp_name: new FormControl('', [Validators.required]),
        middleware: new FormControl('', [Validators.required]),
        logged_in: new FormControl('no', [Validators.required]),
        endpoint_name: new FormControl('', [Validators.required]),
        model_editable: new FormControl('no', [Validators.required]),
        methods: new FormGroup({
          get_m: new FormControl(true, [Validators.required]),
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
      this.validateURL() &&
      this.validateMethods()
    ) {
      if (this.subAppType === techUse.webApp) {
        const subApp: djangoSubAppWebAppTemplate = {
          subapp_name: this.addSubAppFormGroup.get('subapp_name').value,
          middleware: this.addSubAppFormGroup.get('middleware').value,
          logged_in: this.addSubAppFormGroup.get('logged_in').value,
          endpoint_name: this.addSubAppFormGroup.get('endpoint_name').value,
          model_editable: this.addSubAppFormGroup.get('model_editable').value,
          model: {
            model_name: this.addSubAppFormGroup.get('endpoint_name').value,
            model_fields: [],
          },
          methods: {
            get_m: this.addSubAppFormGroup.get('methods').get('get_m').value,
            post: this.addSubAppFormGroup.get('methods').get('post').value,
            put: this.addSubAppFormGroup.get('methods').get('put').value,
            delete: this.addSubAppFormGroup.get('methods').get('del').value,
          },
        };
        if (this.editMode) {
          this.EditSubAppWebApp.emit(subApp);
        } else {
          this.AddSubAppWebApp.emit(subApp);
        }
      } else {
        const subApp: djangoSubAppServicesTemplate = {
          subapp_name: this.addSubAppFormGroup.get('subapp_name').value,
          middleware: this.addSubAppFormGroup.get('middleware').value,
          logged_in: this.addSubAppFormGroup.get('logged_in').value,
          endpoint_name: this.addSubAppFormGroup.get('endpoint_name').value,
          model: {
            model_name: this.addSubAppFormGroup.get('endpoint_name').value,
            model_fields: [],
          },
          methods: {
            get_m: this.addSubAppFormGroup.get('methods').get('get_m').value,
            post: this.addSubAppFormGroup.get('methods').get('post').value,
            put: this.addSubAppFormGroup.get('methods').get('put').value,
            delete: this.addSubAppFormGroup.get('methods').get('del').value,
          },
        };
        if (this.editMode) {
          this.EditSubApp.emit(subApp);
        } else {
          this.AddSubApp.emit(subApp);
        }
      }
      this.manageHide();
    }
  }

  validateNames(): boolean {
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

    if (this.subAppNameList.includes(subAppName) && !this.editMode) {
      this.duplicatedName = true;
      result1 = true;
    }

    if (this.modelsNameList.includes(modelName) && !this.editMode) {
      this.duplicatedModelName = true; // Add the errors to the form
      result2 = true;
    }

    return !(result1 || result2);
  }

  validateURL(): boolean {
    const result = endpointRegex.test(
      this.addSubAppFormGroup.get('middleware').value
    );
    if (!result) this.validUrl = true;
    return result;
  }

  validateMethods() {
    const methods = this.addSubAppFormGroup.get('methods');
    const value =
      methods.get('get_m').value ||
      methods.get('post').value ||
      methods.get('put').value ||
      methods.get('del').value;

    if (!value) {
      this.noMethodChecked = true;
    }
    return value;
  }
}
