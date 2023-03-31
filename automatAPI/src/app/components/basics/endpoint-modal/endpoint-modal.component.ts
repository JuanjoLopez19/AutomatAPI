import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  endpointRegex,
  functionNamePythonRegex,
} from 'src/app/common/constants';
import { flaskEndpointTemplate } from 'src/app/common/interfaces/flaskTemplates';

@Component({
  selector: 'app-endpoint-modal',
  templateUrl: './endpoint-modal.component.html',
  styleUrls: ['./endpoint-modal.component.scss'],
})
export class EndpointModalComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() editMode: boolean = false;
  @Input() endpointData: flaskEndpointTemplate = null;
  @Input() endpointNameList: string[] = [];
  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() endpointAdded: EventEmitter<flaskEndpointTemplate> =
    new EventEmitter<flaskEndpointTemplate>();
  @Output() endpointEdited: EventEmitter<flaskEndpointTemplate> =
    new EventEmitter<flaskEndpointTemplate>();

  addEndpointFormControl: FormGroup;

  duplicatedName: boolean = false;
  validName: boolean = false;
  validUrl: boolean = false;
  noMethodChecked: boolean = false;
  manageHide() {
    this.Hide.emit(false);
    this.show = false;
  }

  onShow() {
    this.validName = false;
    this.validUrl = false;
    this.noMethodChecked = false;
    this.duplicatedName = false;
    if (this.editMode && this.endpointData) {
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
          del: new FormControl(this.endpointData.methods.del === 'yes'),
        }),
      });
    } else {
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
    }
  }
  ngOnInit(): void {
    if (!this.editMode) {
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
    }
  }

  closeModal() {
    if (
      this.addEndpointFormControl.valid &&
      this.validateName() &&
      this.validateUrl() &&
      this.validateMethods() &&
      this.validateDuplicatedName()
    ) {
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
          del: this.addEndpointFormControl.get('methods').get('del').value
            ? 'yes'
            : 'no',
        },
      };
      if (this.editMode) this.endpointEdited.emit(endpoint);
      else this.endpointAdded.emit(endpoint);

      this.manageHide();
    }
  }

  validateName() {
    const result = functionNamePythonRegex.test(
      this.addEndpointFormControl.get('endpoint_name').value
    );
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
      return false
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
