import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { nameRegEx } from 'src/app/common/constants';
import { userParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent {
  @Input() show: boolean = false;

  @Input() userData: userParams = null;

  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() editAccount: EventEmitter<{
    firstName: string;
    lastName: string;
    birthDate: Date;
  }> = new EventEmitter<{
    firstName: string;
    lastName: string;
    birthDate: Date;
  }>();

  @Output() editPassword: EventEmitter<{
    newPassword: string;
    currentPassword: string;
  }> = new EventEmitter<{ newPassword: string; currentPassword: string }>();

  userFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  validName: boolean = false;
  duplicatedName: boolean = false;

  maxDate: Date = new Date();

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.userFormGroup = new FormGroup({
      lastName: new FormControl(this.userData.lastName, [
        Validators.pattern(nameRegEx),
      ]),
      firstName: new FormControl(this.userData.firstName, [
        Validators.required,
        Validators.pattern(nameRegEx),
      ]),
      birthDate: new FormControl(this.userData.birthDate),
    });

    this.passwordFormGroup = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      currentPassword: new FormControl('', [Validators.required]),
    });
  }

  onShow() {
    this.validName = false;
    this.duplicatedName = false;
  }

  manageHide() {
    this.Hide.emit(false);
    this.show = false;
  }

  validateName(): boolean {
    return null;
  }

  checkPasswords(): boolean {
    return null;
  }

  submitForm(type: boolean = false) {
    if (type) {
      console.log(this.userFormGroup.value);
      if (this.userFormGroup.valid) {
        this.editAccount.emit(
          this.userFormGroup.value as {
            firstName: string;
            lastName: string;
            birthDate: Date;
          }
        );
        this.manageHide();
      }
    } else {
      if (this.passwordFormGroup.valid && this.checkPasswords()) {
        this.editPassword.emit(this.passwordFormGroup.value);
        this.manageHide();
      }
    }
  }
}
