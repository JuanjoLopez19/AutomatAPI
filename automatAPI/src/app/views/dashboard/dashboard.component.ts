import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { techType, techUse } from 'src/app/common/enums/enums';
import { userParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activeView: string = 'home';
  user: userParams;
  templateId: string = null;
  userId: string = null;

  constructor(private router: Router, private translate: TranslateService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      const aux = navigation.extras.state as { data: userParams };
      if (aux) this.user = aux.data;
      else this.router.navigate(['/']);
    } else this.router.navigate(['/']);

    this.translate.addLangs(['en', 'es-ES']);
  }
  onActiveTabChange(event: string) {
    this.activeView = event;
  }

  ngOnInit(): void {
    this.chooseLanguage(navigator.language);
  }

  chooseLanguage(language: string) {
    this.translate.use(language);
  }

  changeView(tech: string): void {
    this.activeView = tech;
  }

  onEditTemplate(event: {
    id: number;
    userId: number;
    technology: techType.django | techType.express | techType.flask;
    techType: techUse.services | techUse.webApp;
  }) {
    this.activeView = `edit${
      event.technology.charAt(0).toUpperCase() + event.technology.slice(1)
    }`;
    this.templateId = '' + event.id;
    this.userId = '' + event.userId;
  }

  onUserEdited(event: userParams) {
    this.user = event;
  }
}
