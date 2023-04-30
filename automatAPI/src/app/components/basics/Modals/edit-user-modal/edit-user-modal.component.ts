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
import {
  nameRegEx,
  passwordRegex,
  usernameRegex,
} from 'src/app/common/constants';
import {
  dropdownParams,
  httpResponse,
  userParams,
} from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent {
  @Input() show: boolean = false;
  @Input() adminMode: boolean = false;
  @Input() userData: userParams = null;

  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() userEdited: EventEmitter<void> = new EventEmitter<void>();

  userFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  passwordInvalid: boolean = false;

  accountError: boolean = false;
  accountErrorMsg: string = '';

  passwordError: boolean = false;
  passwordErrorMsg: string = '';

  successAccount: boolean = false;
  successAccountMsg: string = '';

  successPassword: boolean = false;
  successPasswordMsg: string = '';

  maxDate: Date = new Date();

  dropdownItems: dropdownParams[];

  constructor(
    private userService: ManageUsersService,
    private translate: TranslateService
  ) {
    this.translate.get(['T_ADMIN', 'T_USER']).subscribe((res) => {
      this.dropdownItems = [
        { name: res.T_ADMIN, value: 'admin' },
        { name: res.T_USER, value: 'client' },
      ];
    });
  }

  ngOnInit(): void {
    if (!this.adminMode) {
      this.userFormGroup = new FormGroup({
        lastName: new FormControl(this.userData.lastName, [
          Validators.pattern(nameRegEx),
        ]),
        firstName: new FormControl(this.userData.firstName, [
          Validators.required,
          Validators.pattern(nameRegEx),
        ]),
        birthDate: new FormControl(this.userData.birthDate),
        username: new FormControl(this.userData.username, [
          Validators.required,
          Validators.pattern(usernameRegex),
        ]),
        email: new FormControl(this.userData.email, [
          Validators.required,
          Validators.email,
        ]),
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
    } else {
      this.userFormGroup = new FormGroup({
        lastName: new FormControl(this.userData.lastName, [
          Validators.pattern(nameRegEx),
        ]),
        firstName: new FormControl(this.userData.firstName, [
          Validators.required,
          Validators.pattern(nameRegEx),
        ]),
        birthDate: new FormControl(this.userData.birthDate),
        username: new FormControl(this.userData.username, [
          Validators.required,
          Validators.pattern(usernameRegex),
        ]),
        email: new FormControl(this.userData.email, [
          Validators.required,
          Validators.email,
        ]),
        role: new FormControl(this.userData.role, [Validators.required]),
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
      });
    }
  }

  onShow() {
    this.passwordInvalid = false;
    this.accountError = false;
    this.accountErrorMsg = '';
    this.passwordError = false;
    this.passwordErrorMsg = '';
    this.successAccount = false;
    this.successAccountMsg = '';
    this.successPassword = false;
    this.successPasswordMsg = '';

    if (!this.adminMode) {
      this.userFormGroup = new FormGroup({
        lastName: new FormControl(this.userData.lastName, [
          Validators.pattern(nameRegEx),
        ]),
        firstName: new FormControl(this.userData.firstName, [
          Validators.required,
          Validators.pattern(nameRegEx),
        ]),
        birthDate: new FormControl(this.userData.birthDate),
        username: new FormControl(this.userData.username, [
          Validators.required,
          Validators.pattern(usernameRegex),
        ]),
        email: new FormControl(this.userData.email, [
          Validators.required,
          Validators.email,
        ]),
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
    } else {
      this.userFormGroup = new FormGroup({
        lastName: new FormControl(this.userData.lastName, [
          Validators.pattern(nameRegEx),
        ]),
        firstName: new FormControl(this.userData.firstName, [
          Validators.required,
          Validators.pattern(nameRegEx),
        ]),
        birthDate: new FormControl(this.userData.birthDate),
        username: new FormControl(this.userData.username, [
          Validators.required,
          Validators.pattern(usernameRegex),
        ]),
        email: new FormControl(this.userData.email, [
          Validators.required,
          Validators.email,
        ]),
        role: new FormControl(this.userData.role, [Validators.required]),
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
      });
    }
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
        if (!this.adminMode) {
          this.userService
            .editAccount({
              firstName: this.userFormGroup.value.firstName,
              lastName: this.userFormGroup.value.lastName,
              birthDate: this.userFormGroup.value.birthDate,
              email: this.userFormGroup.value.email,
              username: this.userFormGroup.value.username,
            })
            .subscribe({
              next: (data: httpResponse) => {
                this.translate
                  .get(data.message)
                  .subscribe((res: string) => {
                    this.successAccount = true;
                    this.successAccountMsg = res;
                  })
                  .add(() => {
                    this.userEdited.emit();
                    setTimeout(() => {
                      this.manageHide();
                    }, 1500);
                  });
              },
              error: (error) => {
                this.translate
                  .get(error.error.message)
                  .subscribe((res: string) => {
                    this.accountError = true;
                    this.accountErrorMsg = res;
                  });
              },
            });
        } else {
          this.userService
            .editAccountAdmin({
              firstName: this.userFormGroup.value.firstName,
              lastName: this.userFormGroup.value.lastName,
              birthDate: this.userFormGroup.value.birthDate,
              email: this.userFormGroup.value.email,
              username: this.userFormGroup.value.username,
              role: this.userFormGroup.value.role,
              user_id: this.userData.id,
            })
            .subscribe({
              next: (data: httpResponse) => {
                this.translate
                  .get(data.message)
                  .subscribe((res: string) => {
                    this.accountError = false;
                    this.successAccount = true;
                    this.successAccountMsg = res;
                  })
                  .add(() => {
                    setTimeout(() => {
                      this.manageHide();
                    }, 1500);
                  });
              },
              error: (error) => {
                this.translate
                  .get(error.error.message)
                  .subscribe((res: string) => {
                    this.accountError = true;
                    this.accountErrorMsg = res;
                  });
              },
            });
        }
      }
    } else {
      if (this.passwordFormGroup.valid && this.checkPasswords()) {
        if (!this.adminMode) {
          this.userService
            .editPassword({
              currentPassword: this.passwordFormGroup.value.currentPassword,
              newPassword: this.passwordFormGroup.value.password,
            })
            .subscribe({
              next: (data: httpResponse) => {
                this.translate
                  .get(data.message)
                  .subscribe((res: string) => {
                    this.accountError = false;
                    this.successPassword = true;
                    this.successPasswordMsg = res;
                  })
                  .add(() => {
                    setTimeout(() => {
                      this.manageHide();
                    }, 1500);
                  });
              },
              error: (error) => {
                this.translate
                  .get(error.error.message)
                  .subscribe((res: string) => {
                    this.passwordError = true;
                    this.passwordErrorMsg = res;
                  });
              },
            });
        } else {
          this.userService
            .editPasswordAdmin({
              newPassword: this.passwordFormGroup.value.password,
              user_id: this.userData.id,
            })
            .subscribe({
              next: (data: httpResponse) => {
                this.translate
                  .get(data.message)
                  .subscribe((res: string) => {
                    this.successPassword = true;
                    this.successPasswordMsg = res;
                  })
                  .add(() => {
                    setTimeout(() => {
                      this.manageHide();
                    }, 1500);
                  });
              },
              error: (error) => {
                this.translate
                  .get(error.error.message)
                  .subscribe((res: string) => {
                    this.passwordError = true;
                    this.passwordErrorMsg = res;
                  });
              },
            });
        }
      }
    }
  }
}
