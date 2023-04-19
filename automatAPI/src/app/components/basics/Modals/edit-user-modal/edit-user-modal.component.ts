import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ManageUsersService } from 'src/app/api/users/manageUsers/manage-users.service';
import { nameRegEx, passwordRegex } from 'src/app/common/constants';
import { httpResponse, userParams } from 'src/app/common/interfaces/interfaces';

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

  passwordInvalid: boolean = false;
  accountError: boolean = false;
  accountErrorMsg: string = '';
  passwordError: boolean = false;
  passwordErrorMsg: string = '';

  maxDate: Date = new Date();

  constructor(private userService: ManageUsersService) {}

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
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(passwordRegex),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(passwordRegex),
      ]),
      currentPassword: new FormControl('', [Validators.required]),
    });
  }

  onShow() {
    this.passwordInvalid = false;
    this.accountError = false;
    this.accountErrorMsg = '';
    this.passwordError = false;
    this.passwordErrorMsg = '';

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
  }

  manageHide() {
    this.Hide.emit(false);
    this.show = false;
  }

  checkPasswords(): boolean {
    if (
      this.passwordFormGroup.value.password ===
      this.passwordFormGroup.value.confirmPassword
    ) {
      return true;
    } else {
      this.passwordInvalid = true;
      return false;
    }
  }

  submitForm(type: boolean = false) {
    if (type) {
      if (this.userFormGroup.valid) {
        this.userService
          .editAccount(
            this.userFormGroup.value as {
              firstName: string;
              lastName: string;
              birthDate: Date;
            }
          )
          .subscribe({
            next: (data: httpResponse) => {
              this.editAccount.emit(
                this.userFormGroup.value as {
                  firstName: string;
                  lastName: string;
                  birthDate: Date;
                }
              );
              this.manageHide();
            },
            error: (error: httpResponse) => {
              this.accountError = true;
              this.accountErrorMsg = error.message;
            },
          });
      }
    } else {
      if (this.passwordFormGroup.valid && this.checkPasswords()) {
        this.userService
          .editPassword({
            currentPassword: this.passwordFormGroup.value.currentPassword,
            newPassword: this.passwordFormGroup.value.password,
          })
          .subscribe({
            next: (data: httpResponse) => {
              this.editPassword.emit({
                currentPassword: this.passwordFormGroup.value.currentPassword,
                newPassword: this.passwordFormGroup.value.password,
              });
              this.manageHide();
            },
            error: (error: httpResponse) => {
              this.passwordError = true;
              this.passwordErrorMsg = error.message;
            },
          });
        this.editPassword.emit({
          currentPassword: this.passwordFormGroup.value.currentPassword,
          newPassword: this.passwordFormGroup.value.password,
        });
      }
    }
  }
}
