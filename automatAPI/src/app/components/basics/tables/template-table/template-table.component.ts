import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.scss'],
})
export class TemplateTableComponent {
  @Input() isAdmin: boolean = false;


  constructor() {

  }



}
