import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api/auth/auth/auth.service';
import { Sizes } from 'src/app/common/enums/enums';
import {
  httpResponse,
  registerParams,
} from 'src/app/common/interfaces/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  usernameRegex,
  nameRegEx,
  passwordRegex,
} from 'src/app/common/constants';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterService } from 'src/app/api/auth/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() goToLogin: EventEmitter<string> = new EventEmitter<string>();

  registerForm: FormGroup;

  waitingState = false;
  invalidPasswords = false;

  params: registerParams;

  showDialog = false;
  statusCode: number;
  message: string;

  maxDate: Date = new Date();
  readonly sizes: typeof Sizes = Sizes;
  currentSize!: string;
  active: string;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private registerService: RegisterService
  ) {
    this.translate.addLangs(['en', 'es-ES']);
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
    this.router.navigate(['login']);
  }

  goToRemPwd() {
    this.router.navigate(['remember_password'], {});
  }

  onRegister(event: string) {
    this.active = event;
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

  OnRegisterSubmit(): void {
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
            setTimeout(() => {
              this.waitingState = false;
              this.statusCode = response.status;
              this.message = response.message;
              this.showDialog = true;
            }, 1000);
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
  }

  manageHide() {
    this.showDialog = false;
    this.router.navigate(['login']);
  }
  chooseQuote() {
    return navigator.language === 'es-ES'
      ? 'assets/icons/Quote_ES.svg'
      : 'assets/icons/Quote.svg';
  }
}
