import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/api/auth/register/register.service';
import { httpResponse, registerParams } from 'src/app/common/interfaces/interfaces';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {
  nameRegEx,
  passwordRegex,
  usernameRegex,
} from 'src/app/common/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Output() goToLogin: EventEmitter<string> = new EventEmitter<string>();

  registerForm: FormGroup;

  waitingState: boolean = false;
  invalidPasswords: boolean = false;

  params: registerParams;

  showDialog: boolean = false;
  statusCode: number;
  message: string;

  maxDate: Date = new Date();

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl(undefined, {
        validators: [Validators.required, Validators.email],
        updateOn: 'submit',
      }),
      username: new FormControl(undefined, {
        validators: [Validators.required, Validators.pattern(usernameRegex)],
        updateOn: 'submit',
      }),
      name: new FormControl(undefined, {
        validators: [Validators.required, Validators.pattern(nameRegEx)],
        updateOn: 'submit',
      }),
      surname: new FormControl(undefined, {
        validators: [Validators.required, Validators.pattern(nameRegEx)],
        updateOn: 'submit',
      }),
      password: new FormControl(undefined, {
        validators: [Validators.required, Validators.pattern(passwordRegex)],
        updateOn: 'submit',
      }),
      repeatPassword: new FormControl(undefined, {
        validators: [Validators.required, Validators.pattern(passwordRegex)],
        updateOn: 'submit',
      }),
      birthdate: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
    });
  }

  OnRegisterSubmit(event: SubmitEvent): void {
    if (this.registerForm.invalid) {
      return;
    } else {
      if (
        this.registerForm.value.password !==
        this.registerForm.value.repeatPassword
      ) {
        this.invalidPasswords = true;
        return;
      } else {
        this.waitingState = true;
        this.invalidPasswords = false;
        this.params = {
          email: this.registerForm.value.email,
          username: this.registerForm.value.username,
          name: this.registerForm.value.name,
          surname: this.registerForm.value.surname,
          password: this.registerForm.value.password,
          date: this.registerForm.value.birthdate,
        };

        this.registerService.register(this.params).subscribe({
          next: (response: httpResponse) => {
            console.log(response);
            setTimeout(() => {
              this.waitingState = false;
              this.statusCode = response.status;
              this.message = response.message;
              this.showDialog = true;
            }, 1000);

            setTimeout(() => {
              this.goToLogin.emit('sign_in');
            }, 3000);
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            setTimeout(() => {
              this.waitingState = false;
              this.statusCode = error.status;
              this.message = error.error.message;
              this.showDialog = true;
            }, 1500);
          },
        });
      }
    }
  }

  manageHide(event: boolean) {
    this.showDialog = false;
  }
}
