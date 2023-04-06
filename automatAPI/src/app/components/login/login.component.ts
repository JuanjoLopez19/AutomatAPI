import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialService } from 'src/app/api/auth/auth/social/social.service';
import { LoginService } from 'src/app/api/auth/login/login.service';
import { environment } from 'src/environments/env';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private loginService: LoginService,
    private socialService: SocialService
  ) {
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

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('next');
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log('error');
          console.log(error);
        },
      });
    }
  }

  loginWithGoogle(): void {
    window.open(
      `${environment.apiHost}${environment.apiPort}${environment.googleRoute}`,
      '_self'
    );
  }

  loginWithFacebook(): void {
    this.socialService.loginFacebook().subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('next');
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log('error');
        console.log(error);
      },
    });
  }
  loginWithGithub(): void {
    window.open(
      `${environment.apiHost}${environment.apiPort}${environment.githubRoute}`,
      '_self'
    );
  }
}
