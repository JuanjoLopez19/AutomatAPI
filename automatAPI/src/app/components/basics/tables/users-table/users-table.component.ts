import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
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

  constructor(private userService: ManageUsersService) {}

  editUser(user: userParams) {}

  deleteUser(user: userParams) {
    this.userService.deleteUser(Number(user.id)).subscribe({
      next: (data: httpResponse) => {
        console.log(data);
        if (data.status == 200) this.refreshTable.emit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
