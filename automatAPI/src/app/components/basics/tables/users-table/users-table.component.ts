import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ManageUsersService } from 'src/app/api/users/manageUsers/manage-users.service';
import { httpResponse, userParams } from 'src/app/common/interfaces/interfaces';

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
  @Output() unauthorized: EventEmitter<void> = new EventEmitter();

  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  @Output() openSidenav: EventEmitter<void> = new EventEmitter<void>();

  constructor(private userService: ManageUsersService) {}
  showDialog = false;
  user: userParams = null;

  editUser(user: userParams) {
    this.user = user;
    this.openModal();
  }

  deleteUser(user: userParams) {
    this.userService.deleteUser(Number(user.id)).subscribe({
      next: (data: httpResponse) => {
        if (data.status == 200) this.refreshTable.emit();
      },
      error: (err) => {
        if (err.status == 401) this.unauthorized.emit();
      },
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
}
