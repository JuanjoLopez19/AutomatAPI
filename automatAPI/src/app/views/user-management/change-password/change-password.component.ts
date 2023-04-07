import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/api/auth/auth/auth.service';
import { Sizes } from 'src/app/common/enums/enums';
import { changePasswordParams } from 'src/app/common/interfaces/interfaces';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { passwordRegex } from 'src/app/common/constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  params: changePasswordParams;
  waitingState: boolean = false;
  changePasswordForm: FormGroup;
  invalidPasswords: boolean = false;
  private token: string = undefined;
  readonly sizes: typeof Sizes = Sizes;
  currentSize!: string;
  showDialog: boolean = false;
  statusCode: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'es-ES']);
    translate.setDefaultLang('es-ES');
    translate.use('es-ES');

    this.changePasswordForm = new FormGroup({
      password: new FormControl(undefined, {
        validators: [Validators.required, Validators.pattern(passwordRegex)],
        updateOn: 'submit',
      }),
      repeatPassword: new FormControl(undefined, {
        validators: [Validators.required, Validators.pattern(passwordRegex)],
        updateOn: 'submit',
      }),
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const temp = params.get('token');
      if (temp) {
        this.token = temp;
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

  onChangePasswordSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    } else {
      if (
        this.changePasswordForm.value.password ===
        this.changePasswordForm.value.repeatPassword
      ) {
        this.waitingState = true;
        this.invalidPasswords = false;

        this.params = {
          password: this.changePasswordForm.value.password,
          token: this.token,
        };
        this.authService.changePassword(this.params).subscribe({
          next: (response: HttpResponse<any>) => {
            setTimeout(() => {
              this.waitingState = false;
              this.statusCode = response.status;
              this.showDialog = true;
            }, 1500);
          },
          error: (error: HttpErrorResponse) => {
            setTimeout(() => {
              this.waitingState = false;
              this.statusCode = error.status;
              this.showDialog = true;
            }, 1500);
          },
        });
      } else {
        this.invalidPasswords = true;
        return;
      }
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

  manageHide(event: boolean) {
    this.showDialog = false;
    this.router.navigate([''], { state: { active: 'sign_in' } });
  }
}
