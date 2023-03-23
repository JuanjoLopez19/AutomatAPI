import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/api/auth/register/register.service';
import { registerParams } from 'src/app/common/interfaces/interfaces';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  waitingState: boolean = false;
  invalidPasswords: boolean = false;
  params: registerParams;

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
        validators: [Validators.required],
        updateOn: 'submit',
      }),
      name: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
      surname: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
      password: new FormControl(undefined, {
        validators: [
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
          ),
        ],
        updateOn: 'submit',
      }),
      repeatPassword: new FormControl(undefined, {
        validators: [
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
          ),
        ],
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
        console.log(this.registerForm.get('password').value);
        console.log(this.registerForm.get('repeatPassword').value);
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
          next: (response: HttpResponse<any>) => {
            console.log('next');
            console.log(response);
            this.waitingState = false;
            setTimeout(() => {
              this.router.navigate([''], { state: { active: 'sign_in' } });
            }, 2000);
          },
          error: (error: HttpErrorResponse) => {
            console.log('error');
            console.log(error);
            this.waitingState = false;
            setTimeout(() => {
              this.router.navigate([''], { state: { active: 'sign_in' } });
            }, 2000);
          },
        });
      }
    }
  }
}
