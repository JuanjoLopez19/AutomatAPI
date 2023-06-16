import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api/auth/auth/auth.service';
import { Sizes } from 'src/app/common/enums/enums';
import { httpResponse } from 'src/app/common/interfaces/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/env';
import { LoginService } from 'src/app/api/auth/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  waitingState = false;
  readonly sizes: typeof Sizes = Sizes;
  currentSize!: string;
  active: string;
  icon = 'pi pi-send';
  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private loginService: LoginService
  ) {
    this.translate.addLangs(['en', 'es-ES']);
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

  ngOnInit() {
    this.chooseSize(window.innerWidth);
    this.chooseLanguage(navigator.language);
    this.checkSession();
  }

  // Resize Methods
  @HostListener('window:resize')
  onResize() {
    this.chooseSize(window.innerWidth);
  }

  chooseSize(width: number) {
    // 576 xs -> sm
    // 768 sm -> md
    // 1024 md -> lg
    // 1399 lg -> xl

    if (width < 576) {
      this.currentSize = Sizes.XS;
    } else if (width < 768) {
      this.currentSize = Sizes.SM;
    } else if (width < 1024) {
      this.currentSize = Sizes.MD;
    } else if (width < 1399) {
      this.currentSize = Sizes.LG;
    } else {
      this.currentSize = Sizes.XL;
    }
  }

  chooseLanguage(language: string) {
    this.translate.use(language);
  }

  onActiveChange() {
    this.router.navigate(['register'], {});
  }

  goToRemPwd() {
    this.router.navigate(['remember_password'], {});
  }

  checkSession() {
    this.authService.generateSession().subscribe({
      next: (response: httpResponse) => {
        this.router.navigate(['/home'], {
          state: { data: response.data },
        });
      },
      error: () => {
        return;
      },
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
        error: () => {
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

  chooseQuote() {
    return navigator.language === 'es-ES'
      ? 'assets/icons/Quote_ES.svg'
      : 'assets/icons/Quote.svg';
  }
}
