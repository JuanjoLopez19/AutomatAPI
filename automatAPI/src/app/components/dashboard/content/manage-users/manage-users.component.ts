import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { ManageUsersService } from 'src/app/api/users/manageUsers/manage-users.service';
import { TemplateField } from 'src/app/common/enums/enums';
import {
  dropdownParams,
  httpResponse,
  templates,
  userParams,
} from 'src/app/common/interfaces/interfaces';
import { UserField } from 'src/app/common/enums/enums';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent {
  @Input() isAdmin: boolean = false;
  @Input() userId: string = null;
  readonly userField: any = UserField;

  userData!: userParams[];
  backUpData!: userParams[];
  filterForm: FormGroup;

  filterOptions: dropdownParams[] = [];
  fieldOptions: dropdownParams[] = [];
  constructor(
    private manageUserServices: ManageUsersService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
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
        const keys = Object.keys(res);
        for (let i = 0; i < keys.length; i++) {
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
    this.getUserData();
  }

  filterTable(event: SubmitEvent) {
    console.log(this.filterForm.value);
    if (this.filterForm.invalid) return;
    const auxData: userParams[] = [];
    this.backUpData.forEach((user) => {
      if (user[this.filterForm.value.field] === this.filterForm.value.value)
        auxData.push(user);
    });
    this.userData = auxData;
  }

  filterChanged(event: any) {
    this.mapFields(event.value);
  }

  resetTable() {
    this.userData = this.backUpData;
    this.filterForm.get('field')?.setValue(undefined);
    this.filterForm.get('value')?.reset();
    this.fieldOptions = [];
  }

  mapFields(value: string) {
    const auxParams: dropdownParams[] = [];
    this.backUpData.forEach((template) => {
      auxParams.push({
        name: template[value],
        value: template[value],
      } as dropdownParams);
    });
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
          console.log(res);
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
}
