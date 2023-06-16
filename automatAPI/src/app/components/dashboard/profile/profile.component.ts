import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import {
  httpResponse,
  templatesStats,
  userParams,
} from 'src/app/common/interfaces/interfaces';
import { Router } from '@angular/router';
import { ManageUsersService } from 'src/app/api/users/manageUsers/manage-users.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ConfirmationService],
})
export class ProfileComponent implements OnInit {
  @Input() user: userParams;
  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  @Output() openSidenav: EventEmitter<void> = new EventEmitter<void>();
  @Output() userEdited: EventEmitter<userParams> =
    new EventEmitter<userParams>();

  showDialog = false;
  letter: string;
  templates: templatesStats = null;

  constructor(
    private manageTemplatesService: ManageTemplatesService,
    private router: Router,
    private userService: ManageUsersService,
    private confirm: ConfirmationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.letter = this.user.username.charAt(0).toLocaleUpperCase();
    this.manageTemplatesService
      .getUserTemplateStats()
      .subscribe({
        next: (data: httpResponse) => {
          this.templates = data.data as templatesStats;
        },
        error: (err: httpResponse) => {
          if (err.status == 401) {
            this.router.navigate(['/']);
          }
        },
      })
      .add(() => {
        this.onUserEdited();
      });
  }

  deleteAccount(event: Event) {
    this.translate.get('T_DELETE_ACCOUNT').subscribe((res: string) => {
      this.confirm.confirm({
        target: event.target,
        message: res,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.userService.deleteAccount().subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: (err: httpResponse) => {
              if (err.status == 401) {
                this.router.navigate(['/']);
              }
            },
          });
        },
        reject: () => {
          return;
        },
      });
    });
  }

  openModal() {
    this.closeSidenav.emit();
    this.showDialog = true;
  }

  onHide() {
    this.showDialog = false;
    this.openSidenav.emit();
  }

  onUserEdited() {
    this.userService
      .getUserInfo()
      .subscribe({
        next: (data: httpResponse) => {
          this.user = data.data as userParams;
        },
        error: (err) => {
          if (err.status == 401) {
            this.router.navigate(['/']);
          }
        },
      })
      .add(() => {
        this.userEdited.emit(this.user);
      });
  }
}
