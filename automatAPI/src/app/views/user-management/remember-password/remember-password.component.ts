import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/api/auth/auth/auth.service';
import { Sizes } from 'src/app/common/enums/enums';
import {
  httpResponse,
  rememberPasswordParams,
} from 'src/app/common/interfaces/interfaces';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-remember-password',
  templateUrl: './remember-password.component.html',
  styleUrls: ['./remember-password.component.scss'],
})
export class RememberPasswordComponent implements OnInit {
  remPasswordForm: FormGroup;
  params: rememberPasswordParams;
  readonly sizes: typeof Sizes = Sizes;
  currentSize!: string;
  waitingState = false;
  showDialog = false;
  statusCode: number;
  message: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.translate.addLangs(['en', 'es-ES']);

    this.remPasswordForm = new FormGroup({
      email: new FormControl(undefined, {
        validators: [Validators.required, Validators.email],
        updateOn: 'submit',
      }),
      username: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
    });
  }

  ngOnInit(): void {
    this.chooseSize(window.innerWidth);
    this.chooseLanguage(navigator.language);
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

  goToRegister() {
    this.router.navigate(['register'], {
      skipLocationChange: false,
    });
  }

  goToLogin() {
    this.router.navigate(['login'], {
      skipLocationChange: false,
    });
  }

  remPasswordSubmit() {
    if (this.remPasswordForm.invalid) {
      return;
    } else {
      this.waitingState = true;
      this.params = {
        email: this.remPasswordForm.value.email,
        username: this.remPasswordForm.value.username,
      };
      this.authService.rememberPassword(this.params).subscribe({
        next: (response: httpResponse) => {
          setTimeout(() => {
            this.waitingState = false;
            this.statusCode = response.status;
            this.message = response.message;
            this.showDialog = true;
          }, 1500);
        },
        error: (error: HttpErrorResponse) => {
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

  manageHide() {
    this.showDialog = false;
    this.router.navigate([''], { state: { active: 'sign_in' } });
  }

  chooseQuote() {
    return navigator.language === 'es-ES'
      ? 'assets/icons/Quote_ES.svg'
      : 'assets/icons/Quote.svg';
  }
}
