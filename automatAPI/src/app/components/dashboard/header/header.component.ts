import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LogoutService } from 'src/app/api/auth/logout/logout.service';
import { menuItems } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() username: string = 'Username';
  @Input() userImg: string = null; //'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';
  items: any[];

  @Output() navigateToProfile: EventEmitter<string> =
    new EventEmitter<string>();

  letter!: string;

  constructor(
    private translate: TranslateService,
    private logoutService: LogoutService,
    private router: Router
  ) {
    translate.addLangs(['en', 'es-ES']);
    translate.setDefaultLang('es-ES');
    translate.use('es-ES');
  }

  ngOnInit() {
    if (this.userImg == null) {
      this.letter = this.username.charAt(0);
    } else {
      this.letter = null;
    }
    if (this.username.length > 10) {
      this.username = this.username.substring(0, 10) + '...';
    }
    this.chooseLanguage(navigator.language);
    this.translate.get(['T_PROFILE', 'T_LOGOUT']).subscribe((res) => {
      this.items = [
        {
          label: res.T_PROFILE,
          icon: 'pi pi-id-card',
          command: () => {
            this.goToProfile();
          },
        },
        {
          label: res.T_LOGOUT,
          icon: 'pi pi-sign-out',
          command: () => {
            this.logout();
          },
        },
      ];
    });
  }

  chooseLanguage(language: string) {
    this.translate.use(language);
  }

  goToProfile() {
    this.navigateToProfile.emit('profile');
  }

  logout() {
    this.logoutService.logout().subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('next');
        console.log(response);
        this.router.navigate(['']);
      },
      error: (error: HttpErrorResponse) => {
        console.log('error');
        console.log(error);
        this.router.navigate(['']);
      },
    });
  }
}
