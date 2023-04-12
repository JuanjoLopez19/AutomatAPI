import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { httpResponse, templates } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-manage-templates',
  templateUrl: './manage-templates.component.html',
  styleUrls: ['./manage-templates.component.scss'],
})
export class ManageTemplatesComponent implements OnInit {
  @Input() isAdmin: boolean = false;

  templateData!: templates[];
  constructor(private manageTemplatesServices: ManageTemplatesService) {}

  ngOnInit(): void {
    this.manageTemplatesServices.getTemplates().subscribe({
      next: (res: httpResponse) => {
        if (res.status === 200) {
          this.templateData = res.data as templates[];
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.status);
      }
    });
  }
}
