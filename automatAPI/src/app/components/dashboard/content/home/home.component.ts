import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { httpResponse, templates } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Input() username: string = null;
  @Input() isAdmin: boolean = false;
  @Output() changeViewEvent: EventEmitter<string> = new EventEmitter<string>();
  templates: templates[] = [];

  constructor(private manageTemplatesServices: ManageTemplatesService) {}

  ngOnInit(): void {
    this.getTemplateData();
  }
  getTemplateData() {
    this.manageTemplatesServices.getTemplates().subscribe({
      next: (res: httpResponse) => {
        if (res.status === 200) {
          this.templates = res.data as templates[];
        }
      },
      error: (err: HttpErrorResponse) => {
        //if (err.status === 401) this.router.navigate(['/']);
      },
    });
  }

  chooseLang(): string {
    return 'es-ES';
  }

  changeView(tech: string): void {
    this.changeViewEvent.emit(tech);
  }
}
