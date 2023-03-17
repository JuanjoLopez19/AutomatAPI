import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/api/auth/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private loginService: LoginService) {
    this.loginForm = new FormGroup({
      email: new FormControl(undefined, {
        validators: [Validators.required, Validators.email],
        updateOn: 'submit',
      }),
      password: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
    });
  }

  onLoginSubmit($event: SubmitEvent): void {
    console.log("entre");

  }
}
