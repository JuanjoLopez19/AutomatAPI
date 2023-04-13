import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FileDownloaderService } from 'src/app/api/templates/fileDownloader/file-downloader.service';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { templates, httpResponse, userParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent {
  @Input() isAdmin = false;
  @Input() userId: number = null;
  @Input() users: userParams[] = null;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter();
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
        console.log(err);
      },
    });
  }

  editTemplate(template: templates) {
    console.log(template);
  }

  deleteTemplate(template: templates) {
    this.templateService.deleteTemplate(Number(template.id)).subscribe({
      next: (data: httpResponse) => {
        console.log(data);
        if (data.status == 200) this.refreshTable.emit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  OnChanges(changes: SimpleChanges){
    console.log(changes);
  }
}
