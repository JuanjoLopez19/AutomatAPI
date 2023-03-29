import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { menuItems } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  username: string = 'John Doe';
  items: menuItems[];

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'es-ES']);
    translate.setDefaultLang('es-ES');
    translate.use('es-ES');
  }

  ngOnInit() {
    this.chooseLanguage(navigator.language);
    this.translate.get(['T_PROFILE', 'T_LOGOUT']).subscribe((res) => {
      this.items = [
        {
          items: [
            {
              label: res.T_PROFILE,
              icon: 'pi pi-id-card',
            },
            {
              label: res.T_LOGOUT,
              icon: 'pi pi-sign-out',
            },
          ],
        },
      ];
    });
  }

  chooseLanguage(language: string) {
    this.translate.use(language);
  }
}
