import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { userParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activeView: string = 'manage_templates';
  user: userParams;

  constructor(private router: Router, private translate: TranslateService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      const aux = navigation.extras.state as { data: userParams };
      if (aux) this.user = aux.data;
      else this.router.navigate(['/']);
    } else this.router.navigate(['/']);

    translate.addLangs(['en', 'es-ES']);
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
}
