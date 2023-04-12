import { Component, Input, SimpleChanges } from '@angular/core';
import { templates } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.scss'],
})
export class TemplateTableComponent {
  @Input() isAdmin: boolean = false;
  @Input() templates: templates[] = null;

  constructor() {}

  downloadTemplate(template: templates) {
    console.log(template);
  }

  editTemplate(template: templates) {
    console.log(template);
  }

  deleteTemplate(template: templates) {
    console.log(template);
  }
}
