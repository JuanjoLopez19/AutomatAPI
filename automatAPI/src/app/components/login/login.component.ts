import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialService } from 'src/app/api/auth/auth/social/social.service';
import { LoginService } from 'src/app/api/auth/login/login.service';
import { httpResponse } from 'src/app/common/interfaces/interfaces';
import { environment } from 'src/environments/env';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  waitingState: boolean = false;
  icon: string = 'pi pi-send';
  constructor(
    private loginService: LoginService,
    private socialService: SocialService,
    private router: Router
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
      this.waitingState = true;
      this.loginService.login(this.loginForm.value).subscribe({
        next: (response: httpResponse) => {
          setTimeout(() => {
            this.router.navigate(['/home'], {
              state: { data: response.data },
            });
          }, 1500);
        },
        error: (error: HttpErrorResponse) => {
          setTimeout(() => {
            this.waitingState = false;
            this.icon = 'pi pi-exclamation-triangle';
            alert("Couldn't login, please try again");
          }, 1500);
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

  loginWithGithub(): void {
    window.open(
      `${environment.apiHost}${environment.apiPort}${environment.githubRoute}`,
      '_self'
    );
  }
}
