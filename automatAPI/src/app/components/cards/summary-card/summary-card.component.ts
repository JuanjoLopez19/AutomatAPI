import { Component, Input } from '@angular/core';
import { techUse } from 'src/app/common/enums/enums';
import { templates } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent {
  @Input() template: templates = null;
  @Input() numTemplates: number = 0;
  @Input() technologyName: string = '';
  @Input() numServices: number = 0;
  @Input() numApps: number = 0;
  readonly techUse = techUse;

  getIcon(): string {
    if (this.template['tech_type'] === 'services') return 'services_app';
    else if (this.template['tech_type'] === 'app_web') return 'webapp';
    else return 'home';
  }

  getCardWidth(): string {
    return '85%';
  }
}
