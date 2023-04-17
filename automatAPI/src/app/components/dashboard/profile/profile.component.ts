import { Component, Input } from '@angular/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import {
  httpResponse,
  templatesStats,
  userParams,
} from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';
import { ManageUsersService } from 'src/app/api/users/manageUsers/manage-users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() user: userParams;
  letter: string;
  templates: templatesStats = null;

  constructor(
    private manageTemplatesService: ManageTemplatesService,
    private router: Router,
    private userService: ManageUsersService
  ) {}

  ngOnInit(): void {
    this.letter = this.user.username.charAt(0).toLocaleUpperCase();
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

  deleteAccount() {
    this.userService.deleteAccount().subscribe({
      next: (data: httpResponse) => {
        this.router.navigate(['/']);
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
