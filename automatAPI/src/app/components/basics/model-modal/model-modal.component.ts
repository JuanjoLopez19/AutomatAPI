import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { functionNamePythonRegex } from 'src/app/common/constants';
import { DjangoFieldType } from 'src/app/common/enums/enums';
import { djangoModelFields } from 'src/app/common/interfaces/djangoTemplates';
import { dropdownParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-model-modal',
  templateUrl: './model-modal.component.html',
  styleUrls: ['./model-modal.component.scss'],
})
export class ModelModalComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() editMode: boolean = false;

  @Input() fieldData: djangoModelFields = null;
  @Input() fieldNameList: string[] = [];

  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() AddField: EventEmitter<djangoModelFields> =
    new EventEmitter<djangoModelFields>();
  @Output() EditField: EventEmitter<djangoModelFields> =
    new EventEmitter<djangoModelFields>();

  addFieldFormGroup: FormGroup;
  validName: boolean = false;
  duplicatedName: boolean = false;

  djangoFieldTypesSelector: dropdownParams[];

  constructor(private translate: TranslateService) {
    this.translate
      .get('T_SELECT_ONE')
      .subscribe((res: string) => {
        this.djangoFieldTypesSelector = [
          {
            name: res,
            value: '',
          },
        ];
      })
      .add(() => {
        this.mapFields();
      });
  }

  ngOnInit(): void {
    if (!this.editMode) {
      this.addFieldFormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        null: new FormControl(false, [Validators.required]),
        default: new FormControl('', [Validators.required]),
        blank: new FormControl(false, [Validators.required]),
      });
    }
  }

  mapFields() {
    const fieldTypes = Object.values(DjangoFieldType);
    fieldTypes.forEach((fieldType) => {
      this.djangoFieldTypesSelector.push({
        name: fieldType,
        value: fieldType,
      });
    });
  }

  onShow() {
    this.validName = false;
    this.duplicatedName = false;
    if (this.editMode && this.fieldData) {
      this.addFieldFormGroup = new FormGroup({
        name: new FormControl(this.fieldData.name, [Validators.required]),
        type: new FormControl(this.fieldData.type, [Validators.required]),
        null: new FormControl(this.fieldData.null === 'True', [
          Validators.required,
        ]),
        default: new FormControl(this.fieldData.default, [Validators.required]),
        blank: new FormControl(this.fieldData.null === 'True', [
          Validators.required,
        ]),
      });
    } else {
      this.addFieldFormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        null: new FormControl(false, [Validators.required]),
        default: new FormControl('', [Validators.required]),
        blank: new FormControl(false, [Validators.required]),
      });
    }
  }

  manageHide() {
    this.Hide.emit(false);
    this.show = false;
  }
  closeModal() {
    if (
      this.addFieldFormGroup.valid &&
      this.validateName() &&
      this.validateDuplicatedName()
    ) {
      const field: djangoModelFields = {
        name: this.addFieldFormGroup.get('name').value,
        type: this.addFieldFormGroup.get('type').value,
        null: this.addFieldFormGroup.get('null').value ? 'True' : 'False',
        default: this.addFieldFormGroup.get('default').value,
        blank: this.addFieldFormGroup.get('blank').value ? 'True' : 'False',
      };
      if (this.editMode) {
        this.EditField.emit(field);
      }
      this.AddField.emit(field);

      this.manageHide();
    }
  }

  validateName() {
    let result = false;
    result = functionNamePythonRegex.test(
      this.addFieldFormGroup.get('name').value
    );

    if (!result) {
      this.validName = true;
    }
    return result;
  }

  validateDuplicatedName() {
    const name = this.addFieldFormGroup.get('name').value;
    const result = this.fieldNameList.includes(name);
    if (result && !this.editMode) {
      this.duplicatedName = true;
      return false;
    }
    return true;
  }
}
