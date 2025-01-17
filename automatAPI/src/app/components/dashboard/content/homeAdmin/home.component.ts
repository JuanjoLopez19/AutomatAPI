import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import {
  httpResponse,
  templatesStats,
} from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeAdminComponent implements OnInit {
  @Input() username: string = null;
  @Input() isAdmin = false;
  @Output() changeViewEvent: EventEmitter<string> = new EventEmitter<string>();
  templates: templatesStats = null;

  maxValue = 0;
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
        const keys = Object.keys(this.templates);
        keys.forEach((key) => {
          this.maxValue =
            Number(this.templates[key]['services']) +
            Number(this.templates[key]['app_web']) +
            this.maxValue;
        });
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
