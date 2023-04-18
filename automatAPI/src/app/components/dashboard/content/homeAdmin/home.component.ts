import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import {
  httpResponse,
  templates,
  templatesStats,
} from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';
import { ManageUsersService } from 'src/app/api/users/manageUsers/manage-users.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeAdminComponent {
  @Input() username: string = null;
  @Input() isAdmin: boolean = false;
  @Output() changeViewEvent: EventEmitter<string> = new EventEmitter<string>();
  templates: templatesStats = null;

  constructor(
    private manageTemplatesServices: ManageTemplatesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTemplateData();
  }

  getTemplateData() {
    this.manageTemplatesServices.getTemplateStats().subscribe({
      next: (data: httpResponse) => {
        this.templates = data.data as templatesStats;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 401) {
          this.router.navigate(['/']);
        }
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
