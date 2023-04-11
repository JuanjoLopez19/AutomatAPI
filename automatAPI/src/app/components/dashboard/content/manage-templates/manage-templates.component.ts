import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-manage-templates',
  templateUrl: './manage-templates.component.html',
  styleUrls: ['./manage-templates.component.scss']
})
export class ManageTemplatesComponent {
  @Input() isAdmin: boolean = false;
}
