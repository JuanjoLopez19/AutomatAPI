import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ManageUsersService } from 'src/app/api/users/manageUsers/manage-users.service';
import {
  dropdownParams,
  httpResponse,
  userParams,
} from 'src/app/common/interfaces/interfaces';
import { UserField } from 'src/app/common/enums/enums';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  providers: [DatePipe],
})
export class ManageUsersComponent {
  @Input() isAdmin: boolean = false;
  @Input() userId: string = null;

  @Output() closeSideNav: EventEmitter<void> = new EventEmitter<void>();
  @Output() openSideNav: EventEmitter<void> = new EventEmitter<void>();

  readonly userField: any = UserField;

  userData!: userParams[];
  backUpData!: userParams[];
  filterForm: FormGroup;

  filterOptions: dropdownParams[] = [];
  fieldOptions: dropdownParams[] = [];

  backUp: dropdownParams;

  constructor(
    private manageUserServices: ManageUsersService,
    private translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'T_SELECT_ONE',
        'T_USER_ID',
        'T_USER_USERNAME',
        'T_USER_EMAIL',
        'T_USER_DATE',
        'T_USER_FIRSTNAME',
        'T_USER_LASTNAME',
        'T_USER_GOOGLE',
        'T_USER_GITHUB',
        'T_USER_ROLE',
      ])
      .subscribe((res: any) => {
        this.filterOptions.push({ name: res.T_SELECT_ONE, value: undefined });
        this.backUp = { name: res.T_SELECT_ONE, value: undefined };
        const keys = Object.keys(res);
        for (let i = 1; i < keys.length; i++) {
          this.filterOptions.push({
            name: res[keys[i]],
            value: this.userField[keys[i]],
          });
        }
      });
    this.filterForm = new FormGroup({
      field: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      value: new FormControl(undefined, {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
    });

    this.fieldOptions = [this.backUp];
    this.getUserData();
  }

  filterTable(event: SubmitEvent) {
    if (this.filterForm.invalid) return;
    const auxData: userParams[] = [];
    if (
      this.filterForm.value.field === 'google_id' ||
      this.filterForm.value.field === 'github_id'
    ) {
      this.backUpData.forEach((user) => {
        if (
          this.filterForm.value.value === 'Yes' &&
          user[this.filterForm.value.field] !== null
        )
          auxData.push(user);
        else if (
          this.filterForm.value.value === 'No' &&
          user[this.filterForm.value.field] === null
        )
          auxData.push(user);
      });
    } else {
      this.backUpData.forEach((user) => {
        if (user[this.filterForm.value.field] === this.filterForm.value.value)
          auxData.push(user);
      });
    }
    this.userData = auxData;
  }

  filterChanged(event: any) {
    this.mapFields(event.value);
  }

  resetTable() {
    this.userData = this.backUpData;
    this.filterForm.get('field')?.setValue(undefined);
    this.filterForm.get('value')?.reset();
    this.fieldOptions = [this.backUp];
  }

  mapFields(value: string) {
    const auxParams: dropdownParams[] = [];
    if (value === 'google_id' || value === 'github_id') {
      auxParams.push({
        name: 'Yes',
        value: 'Yes',
      } as dropdownParams);
      auxParams.push({
        name: 'No',
        value: 'No',
      } as dropdownParams);
    } else {
      this.backUpData.forEach((template) => {
        if (value === 'date') {
          auxParams.push({
            name: this.datePipe.transform(template[value]),
            value: template[value],
          } as dropdownParams);
        } else
          auxParams.push({
            name: template[value],
            value: template[value],
          } as dropdownParams);
      });
    }
    this.fieldOptions = [
      ...Array.from(new Set(auxParams.map((item) => JSON.stringify(item)))).map(
        (item) => JSON.parse(item)
      ),
    ];
  }

  getUserData() {
    this.manageUserServices.getUsers().subscribe({
      next: (res: httpResponse) => {
        if (res.status === 200) {
          this.userData = res.data as userParams[];
          this.backUpData = res.data as userParams[];
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) this.router.navigate(['/']);
      },
    });
  }

  onTemplateChanged() {
    this.getUserData();
  }

  parseInt(value: string) {
    return Number(value);
  }

  unauth() {
    this.router.navigate(['/']);
  }

  closeSidenav() {
    this.closeSideNav.emit();
  }

  openSidenav() {
    this.openSideNav.emit();
  }
}
