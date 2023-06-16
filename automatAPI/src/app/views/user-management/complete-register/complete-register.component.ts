import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/api/auth/auth/auth.service';
import { passwordRegex, databaseRegEx } from 'src/app/common/constants';
import { Sizes } from 'src/app/common/enums/enums';
import {
  completeRegisterParams,
  httpResponse,
} from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-complete-register',
  templateUrl: './complete-register.component.html',
  styleUrls: ['./complete-register.component.scss'],
})
export class CompleteRegisterComponent implements OnInit {
  readonly sizes: typeof Sizes = Sizes;

  token = '';
  type = '';

  completeRegisterForm: FormGroup;
  params: completeRegisterParams;

  currentSize!: string;
  waitingState = false;

  showDialog = false;
  statusCode: number;
  message: string;

  validUsername = false;
  pwdValid = false;
  pwdConfirmValid = false;
  checkPwd = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.translate.addLangs(['en', 'es-ES']);

    this.completeRegisterForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.email],
        updateOn: 'submit',
      }),
      username: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
      password: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
      passwordConfirm: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      const type = params.get('type');
      if (token && type) {
        this.token = token;
        this.type = type;
      } else {
        this.router.navigate(['']);
      }
    });

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
    this.router.navigate([''], {
      skipLocationChange: false,
      state: { active: 'sign_up' },
    });
  }

  goToLogin() {
    this.router.navigate([''], {
      skipLocationChange: false,
      state: { active: 'sign_in' },
    });
  }

  completeRegisterSubmit() {
    if (
      this.completeRegisterForm.valid &&
      this.validateUsername() &&
      this.validatePwds()
    ) {
      this.waitingState = true;
      this.params = {
        email: this.completeRegisterForm.value.email,
        username: this.completeRegisterForm.value.username,
        password: this.completeRegisterForm.value.password,
        access_token: this.token,
      };

      this.authService.completeRegister(this.params).subscribe({
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

  validateUsername(): boolean {
    this.validUsername = false;
    const result = databaseRegEx.test(this.completeRegisterForm.value.username);
    if (!result) {
      this.validUsername = true;
    }

    return result;
  }

  validatePwds(): boolean {
    let result = true;
    this.pwdValid = false;
    this.pwdConfirmValid = false;
    this.checkPwd = false;
    if (passwordRegex.test(this.completeRegisterForm.value.password) !== true) {
      this.pwdValid = true;
      result = false;
    }
    if (
      passwordRegex.test(this.completeRegisterForm.value.passwordConfirm) !==
      true
    ) {
      this.pwdConfirmValid = true;
      return false;
    }
    if (
      this.completeRegisterForm.value.password !==
      this.completeRegisterForm.value.passwordConfirm
    ) {
      this.checkPwd = true;
      result = false;
    }
    return result;
  }

  manageHide() {
    this.showDialog = false;
    this.router.navigate(['']);
  }

  chooseQuote() {
    return navigator.language === 'es-ES'
      ? 'assets/icons/Quote_ES.svg'
      : 'assets/icons/Quote.svg';
  }
}
