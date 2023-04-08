import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  endpointRegex,
  functionNameJSRegex,
  functionNamePythonRegex,
} from 'src/app/common/constants';
import { httpMethods } from 'src/app/common/enums/enums';
import { djangoEndpointTemplate } from 'src/app/common/interfaces/djangoTemplates';
import { expressEndpointTemplate } from 'src/app/common/interfaces/expressTemplates';
import { flaskEndpointTemplate } from 'src/app/common/interfaces/flaskTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-endpoint-modal',
  templateUrl: './endpoint-modal.component.html',
  styleUrls: ['./endpoint-modal.component.scss'],
})
export class EndpointModalComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() editMode: boolean = false;
  @Input() endpointData: flaskEndpointTemplate = null;
  @Input() endpointDataExpress: expressEndpointTemplate = null;
  @Input() endpointDataDjango: djangoEndpointTemplate = null;
  @Input() endpointNameList: string[] = [];
  @Input() endpointUrlList: string[] = [];
  @Input() type: string = 'flask';

  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() endpointAdded: EventEmitter<flaskEndpointTemplate> =
    new EventEmitter<flaskEndpointTemplate>();
  @Output() endpointEdited: EventEmitter<flaskEndpointTemplate> =
    new EventEmitter<flaskEndpointTemplate>();

  @Output() endpointAddedExpress: EventEmitter<expressEndpointTemplate> =
    new EventEmitter<expressEndpointTemplate>();
  @Output() endpointEditedExpress: EventEmitter<expressEndpointTemplate> =
    new EventEmitter<expressEndpointTemplate>();

  @Output() endpointAddedDjango: EventEmitter<djangoEndpointTemplate> =
    new EventEmitter<djangoEndpointTemplate>();
  @Output() endpointEditedDjango: EventEmitter<djangoEndpointTemplate> =
    new EventEmitter<djangoEndpointTemplate>();

  addEndpointFormControl: FormGroup;

  duplicatedName: boolean = false;
  validName: boolean = false;
  validUrl: boolean = false;
  noMethodChecked: boolean = false;
  duplicatedUrl: boolean = false;

  httpMethodSelector: dropdownParams[];

  urlBackUp: string = '';

  constructor(private translate: TranslateService) {
    this.translate.get('T_SELECT_ONE').subscribe((res: string) => {
      this.httpMethodSelector = [
        {
          name: res,
          value: '',
        },
        { name: httpMethods.get, value: httpMethods.get },
        { name: httpMethods.post, value: httpMethods.post },
        { name: httpMethods.put, value: httpMethods.put },
        { name: httpMethods.delete, value: httpMethods.delete },
      ];
    });
  }
  ngOnInit(): void {
    if (!this.editMode) {
      if (this.type == 'flask') {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          endpoint_comment: new FormControl(''),
          endpoint_url: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          methods: new FormGroup({
            get_m: new FormControl(true),
            post: new FormControl(false),
            put: new FormControl(false),
            del: new FormControl(false),
          }),
        });
      } else if (this.type == 'django') {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          endpoint_comment: new FormControl(''),
          endpoint_url: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          logged_in: new FormControl('no'),
          methods: new FormGroup({
            get_m: new FormControl(true),
            post: new FormControl(false),
            put: new FormControl(false),
            del: new FormControl(false),
          }),
        });
      } else {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl('', {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          endpoint_comment: new FormControl(''),
          endpoint_url: new FormControl('', {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          method: new FormControl('get', {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
        });
      }
    }
  }
  manageHide() {
    this.Hide.emit(false);
    this.show = false;
  }

  onShow() {
    this.validName = false;
    this.validUrl = false;
    this.noMethodChecked = false;
    this.duplicatedName = false;
    this.duplicatedUrl = false;

    if (
      this.editMode &&
      (this.endpointData || this.endpointDataExpress || this.endpointDataDjango)
    ) {
      if (this.type == 'flask') {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl(this.endpointData.endpoint_name, {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          endpoint_comment: new FormControl(this.endpointData.endpoint_comment),
          endpoint_url: new FormControl(this.endpointData.endpoint_url, {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          methods: new FormGroup({
            get_m: new FormControl(this.endpointData.methods.get_m === 'yes'),
            post: new FormControl(this.endpointData.methods.post === 'yes'),
            put: new FormControl(this.endpointData.methods.put === 'yes'),
            del: new FormControl(this.endpointData.methods.delete === 'yes'),
          }),
        });
        this.urlBackUp = this.endpointData.endpoint_url;
      } else if (this.type == 'django') {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl(
            this.endpointDataDjango.endpoint_name,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
          endpoint_comment: new FormControl(
            this.endpointDataDjango.endpoint_comment
          ),
          endpoint_url: new FormControl(this.endpointDataDjango.endpoint_url, {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          logged_in: new FormControl(this.endpointDataDjango.logged_in),
          methods: new FormGroup({
            get_m: new FormControl(
              this.endpointDataDjango.methods.get_m === 'yes'
            ),
            post: new FormControl(
              this.endpointDataDjango.methods.post === 'yes'
            ),
            put: new FormControl(this.endpointDataDjango.methods.put === 'yes'),
            del: new FormControl(
              this.endpointDataDjango.methods.delete === 'yes'
            ),
          }),
        });
        this.urlBackUp = this.endpointDataDjango.endpoint_url;
      } else {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl(
            this.endpointDataExpress.endpoint_name,
            {
              validators: [Validators.required],
              updateOn: 'blur',
            }
          ),
          endpoint_comment: new FormControl(
            this.endpointDataExpress.endpoint_comment
          ),
          endpoint_url: new FormControl(this.endpointDataExpress.endpoint_url, {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          method: new FormControl(this.endpointDataExpress.method, {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
        });
        this.urlBackUp = this.endpointDataExpress.endpoint_url;
      }
    } else {
      if (this.type == 'flask') {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          endpoint_comment: new FormControl(''),
          endpoint_url: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          methods: new FormGroup({
            get_m: new FormControl(true),
            post: new FormControl(false),
            put: new FormControl(false),
            del: new FormControl(false),
          }),
        });
      } else if (this.type == 'django') {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          endpoint_comment: new FormControl(''),
          endpoint_url: new FormControl('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          logged_in: new FormControl('no'),
          methods: new FormGroup({
            get_m: new FormControl(true),
            post: new FormControl(false),
            put: new FormControl(false),
            del: new FormControl(false),
          }),
        });
      } else {
        this.addEndpointFormControl = new FormGroup({
          endpoint_name: new FormControl('', {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          endpoint_comment: new FormControl(''),
          endpoint_url: new FormControl('', {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
          method: new FormControl('get', {
            validators: [Validators.required],
            updateOn: 'blur',
          }),
        });
      }
    }
  }

  closeModal() {
    if (
      this.addEndpointFormControl.valid &&
      this.validateName() &&
      this.validateUrl() &&
      this.validateMethods() &&
      this.validateDuplicatedName() &&
      this.validateDuplicatedUrl()
    ) {
      if (this.type == 'flask') {
        const endpoint: flaskEndpointTemplate = {
          endpoint_name: this.addEndpointFormControl.get('endpoint_name').value,
          endpoint_comment:
            this.addEndpointFormControl.get('endpoint_comment').value,
          endpoint_url: this.sanitizeUrl(
            this.addEndpointFormControl.get('endpoint_url').value
          ),
          methods: {
            get_m: this.addEndpointFormControl.get('methods').get('get_m').value
              ? 'yes'
              : 'no',
            post: this.addEndpointFormControl.get('methods').get('post').value
              ? 'yes'
              : 'no',
            put: this.addEndpointFormControl.get('methods').get('put').value
              ? 'yes'
              : 'no',
            delete: this.addEndpointFormControl.get('methods').get('del').value
              ? 'yes'
              : 'no',
          },
        };
        if (this.editMode) this.endpointEdited.emit(endpoint);
        else this.endpointAdded.emit(endpoint);
      } else if (this.type == 'django') {
        const endpoint: djangoEndpointTemplate = {
          endpoint_name: this.addEndpointFormControl.get('endpoint_name').value,
          endpoint_comment:
            this.addEndpointFormControl.get('endpoint_comment').value,
          endpoint_url: this.sanitizeUrl(
            this.addEndpointFormControl.get('endpoint_url').value
          ),
          logged_in: this.addEndpointFormControl.get('logged_in').value,
          methods: {
            get_m: this.addEndpointFormControl.get('methods').get('get_m').value
              ? 'yes'
              : 'no',
            post: this.addEndpointFormControl.get('methods').get('post').value
              ? 'yes'
              : 'no',
            put: this.addEndpointFormControl.get('methods').get('put').value
              ? 'yes'
              : 'no',
            delete: this.addEndpointFormControl.get('methods').get('del').value
              ? 'yes'
              : 'no',
          },
        };
        if (this.editMode) this.endpointEditedDjango.emit(endpoint);
        else this.endpointAddedDjango.emit(endpoint);
      } else {
        const endpoint: expressEndpointTemplate = {
          endpoint_name: this.addEndpointFormControl.get('endpoint_name').value,
          endpoint_comment:
            this.addEndpointFormControl.get('endpoint_comment').value,
          endpoint_url: this.sanitizeUrl(
            this.addEndpointFormControl.get('endpoint_url').value
          ),
          method: this.addEndpointFormControl.get('method').value,
        };
        if (this.editMode) this.endpointEditedExpress.emit(endpoint);
        else this.endpointAddedExpress.emit(endpoint);
      }

      this.manageHide();
    }
  }

  validateName() {
    let result = false;
    if (this.type === 'flask') {
      result = functionNamePythonRegex.test(
        this.addEndpointFormControl.get('endpoint_name').value
      );
    } else {
      result = functionNameJSRegex.test(
        this.addEndpointFormControl.get('endpoint_name').value
      );
    }
    if (!result) {
      this.validName = true;
    }
    return result;
  }

  validateUrl() {
    const result = endpointRegex.test(
      this.addEndpointFormControl.get('endpoint_url').value
    );
    if (!result) {
      this.validUrl = true;
    }
    return result;
  }

  validateMethods() {
    if (this.type === 'express') return true;

    const methods = this.addEndpointFormControl.get('methods');
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

  validateDuplicatedName() {
    const name = this.addEndpointFormControl.get('endpoint_name').value;
    const result = this.endpointNameList.includes(name);
    if (result && !this.editMode) {
      this.duplicatedName = true;
      return false;
    }
    return true;
  }

  validateDuplicatedUrl() {
    const url = this.addEndpointFormControl.get('endpoint_url').value as string;
    let substring: string;
    let result: boolean;
    if (url.startsWith('/')) {
      substring = url.substring(1);
      result = this.endpointUrlList.includes(substring);
    } else result = this.endpointUrlList.includes(url);

    if (
      (result && !this.editMode) ||
      (result && substring !== this.urlBackUp)
    ) {
      this.duplicatedUrl = true;
      return false;
    }
    return true;
  }

  sanitizeUrl(url: string) {
    if (url.startsWith('/')) {
      return url;
    } else {
      return '/' + url;
    }
  }
}
