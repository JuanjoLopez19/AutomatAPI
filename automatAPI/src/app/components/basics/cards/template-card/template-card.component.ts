import { Component, Input } from '@angular/core';
import { templates } from 'src/app/common/interfaces/interfaces';
import { techUse } from 'src/app/common/enums/enums';
import { techType } from 'src/app/common/enums/enums';

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss'],
})
export class TemplateCardComponent {
  @Input() template: templates = null;
  @Input() numTemplates: number = 0;
  readonly techUse = techUse;

  getIcon(): string {
    if (this.template['tech_type'] === techUse.services) return 'services_app';
    else if (this.template['tech_type'] === techUse.webApp) return 'webapp';
    else return 'home';
  }

  getCardWidth(): string {
    if (this.numTemplates >= 3) return '300px';
    else return '100%';
  }

  getClass(): string {
    switch (this.template['technology']) {
      case techType.flask:
        switch (this.template['tech_type']) {
          case techUse.services:
            return 'flask services';
          case techUse.webApp:
            return 'flask app_web';
        }
      case techType.express:
        switch (this.template['tech_type']) {
          case techUse.services:
            return 'express services';
          case techUse.webApp:
            return 'express app_web';
        }
      case techType.django:
        switch (this.template['tech_type']) {
          case techUse.services:
            return 'django services';
          case techUse.webApp:
            return 'django app_web';
        }

      default:
        return 'flask services';
    }
  }
}
