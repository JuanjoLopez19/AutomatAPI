import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/api/auth/auth/auth.service';
import { Sizes } from 'src/app/common/enums/enums';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.scss'],
})
export class ActivateUserComponent implements OnInit {
  private token: string = undefined;
  waitingState: boolean = false;
  readonly sizes: typeof Sizes = Sizes;
  currentSize!: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'es-ES']);
    translate.setDefaultLang('es-ES');
    translate.use('es-ES');
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

  chooseLanguage(language: string) {
    this.translate.use(language);
  }

  activateAccount() {
    this.waitingState = true;
    this.authService.activateAccount(this.token).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('next');
        console.log(response);
        window.alert(this.translate.getTranslation('T_ACCOUNT_ACTIVATED'));
        this.waitingState = false;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        console.log('error');
        console.log(error);
        window.alert(this.translate.getTranslation('T_ACCOUNT_NO_ACTIVATED'));
        this.waitingState = false;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      },
    });
  }
}
