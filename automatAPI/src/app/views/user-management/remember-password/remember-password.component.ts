import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/api/auth/auth/auth.service';
import { Sizes } from 'src/app/common/enums/enums';
import { rememberPasswordParams } from 'src/app/common/interfaces/interfaces';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-remember-password',
  templateUrl: './remember-password.component.html',
  styleUrls: ['./remember-password.component.scss'],
})
export class RememberPasswordComponent {
  remPasswordForm: FormGroup;
  params: rememberPasswordParams;
  readonly sizes: typeof Sizes = Sizes;
  currentSize!: string;
  waitingState: boolean = false;
  showDialog: boolean = false;
  statusCode: number;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'es-ES']);
    translate.setDefaultLang('es-ES');
    translate.use('es-ES');

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
    }
  }

  manageHide(event: boolean) {
    this.showDialog = false;
    this.router.navigate([''], { state: { active: 'sign_in' } });
  }
}
