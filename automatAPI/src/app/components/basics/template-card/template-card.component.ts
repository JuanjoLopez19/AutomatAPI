import { Component, Input } from '@angular/core';
import { templates } from 'src/app/common/interfaces/interfaces';
import { techUse } from 'src/app/common/enums/enums';

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
    if (this.template['tech_type'] === 'services') return 'services_app';
    else if (this.template['tech_type'] === 'app_web') return 'webapp';
    else return 'home';
  }

  getCardWidth(): string {
    if (this.numTemplates >= 3) return '350px';
    else return '100%';
  }
}
