import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LogoutService } from 'src/app/api/auth/logout/logout.service';

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
    private router: Router,
    private elementRef: ElementRef
  ) {
    translate.addLangs(['en', 'es-ES']);
    translate.setDefaultLang('es-ES');
    translate.use('es-ES');

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

  ngOnInit() {
    if (this.userImg == null) {
      this.letter = this.username.charAt(0).toLocaleUpperCase();
    } else {
      this.letter = null;
    }
    if (this.username.length > 10) {
      this.username = this.username.substring(0, 10) + '...';
    }
    this.chooseLanguage(navigator.language);
  }

  ngAfterViewInit() {
    const avatar = this.elementRef.nativeElement.querySelector(
      '#avatar'
    ) as HTMLElement;
    if (this.userImg !== null) {
      (avatar.childNodes[0] as HTMLElement).style.backgroundColor = "rgba(0, 0, 0, 0)"
      const image = avatar.childNodes[0].firstChild as HTMLImageElement;
      image.setAttribute('onerror', 'this.style.display = "none"');
      image.setAttribute('referrerPolicy', 'no-referrer');
    }
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
