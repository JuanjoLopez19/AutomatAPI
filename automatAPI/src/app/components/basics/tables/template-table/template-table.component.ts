import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
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
    console.log(template);
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
