import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { techType, techUse } from 'src/app/common/enums/enums';
import { httpResponse, templates } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.scss'],
})
export class TemplateTableComponent {
  @Input() isAdmin = false;
  @Input() userId: number = null;
  @Input() templates: templates[] = null;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter();
  @Output() unauthorized: EventEmitter<void> = new EventEmitter();
  @Output() onEditTemplate: EventEmitter<{
    id: number;
    userId: number;
    technology: techType.django | techType.express | techType.flask;
    techType: techUse.services | techUse.webApp;
  }> = new EventEmitter();

  constructor(
    private templateService: ManageTemplatesService,
    private fileDownloaderService: FileDownloaderService
  ) {}

  downloadTemplate(template: templates) {
    this.templateService.getToken(Number(template.id)).subscribe({
      next: (data: httpResponse) => {
        console.log(data);
        if (data.status == 200) {
          this.fileDownloaderService.downloadFile(data.data, template.app_name);
        }
      },
      error: (err) => {
        if (err.status == 401) this.unauthorized.emit();
      },
    });
  }

  editTemplate(template: templates) {
    this.onEditTemplate.emit({
      id: Number(template.id),
      userId: Number(template.user_id),
      technology: template.technology,
      techType: template.tech_type,
    });
  }

  deleteTemplate(template: templates) {
    if (this.isAdmin) {
      this.templateService
        .deleteTemplateAdmin(Number(template.user_id), Number(template.id))
        .subscribe({
          next: (data: httpResponse) => {
            console.log(data);
            if (data.status == 200) this.refreshTable.emit();
          },
          error: (err) => {
            if (err.status == 401) this.unauthorized.emit();
          },
        });
    } else {
      this.templateService.deleteTemplate(Number(template.id)).subscribe({
        next: (data: httpResponse) => {
          console.log(data);
          if (data.status == 200) this.refreshTable.emit();
        },
        error: (err) => {
          if (err.status == 401) this.unauthorized.emit();
        },
      });
    }
  }
}
