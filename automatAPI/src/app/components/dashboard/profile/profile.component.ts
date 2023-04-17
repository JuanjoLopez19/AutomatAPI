import { Component, Input } from '@angular/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import {
  httpResponse,
  templatesStats,
  userParams,
} from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() user: userParams;
  templates: templatesStats = null;

  constructor(
    private manageTemplatesService: ManageTemplatesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.manageTemplatesService.getUserTemplateStats().subscribe({
      next: (data: httpResponse) => {
        this.templates = data.data as templatesStats;
        console.log(this.templates);
      },
      error: (err: httpResponse) => {
        console.log(err);
        if (err.status == 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }
}
