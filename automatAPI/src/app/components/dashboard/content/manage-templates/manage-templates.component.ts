import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { TemplateField } from 'src/app/common/enums/enums';
import {
  dropdownParams,
  httpResponse,
  templates,
} from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-manage-templates',
  templateUrl: './manage-templates.component.html',
  styleUrls: ['./manage-templates.component.scss'],
})
export class ManageTemplatesComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  readonly templateField: any = TemplateField;

  templateData!: templates[];
  filterForm: FormGroup;

  filterOptions: dropdownParams[] = [];
  fieldOptions: dropdownParams[] = [];
  constructor(
    private manageTemplatesServices: ManageTemplatesService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'T_TEMPLATE_ID',
        'T_TEMPLATE_USER',
        'T_TEMPLATE_NAME',
        'T_TEMPLATE_DESC',
        'T_TEMPLATE_TECH',
        'T_TEMPLATE_TECH_TYPE',
        'T_TEMPLATE_DATE',
      ])
      .subscribe((res: any) => {
        const keys = Object.keys(res);
        for (let i = 0; i < keys.length; i++) {
          if (
            !this.isAdmin &&
            (keys[i] === 'T_TEMPLATE_ID' || keys[i] === 'T_TEMPLATE_USER')
          )
            continue;
          else {
            this.filterOptions.push({
              name: res[keys[i]],
              value: this.templateField[keys[i]],
            });
          }
        }
      });
  }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      field: new FormControl(undefined, { updateOn: 'submit' }),
      value: new FormControl(undefined, { updateOn: 'submit' }),
    });
    this.manageTemplatesServices.getTemplates().subscribe({
      next: (res: httpResponse) => {
        if (res.status === 200) {
          this.templateData = res.data as templates[];
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.status);
      },
    });
  }

  filterTable(event: SubmitEvent) {
    console.log(event);
  }

  filterChanged(event: any) {
    console.log(event);
    this.mapFields(event.value);
  }

  mapFields(value: string) {
    const auxParams: dropdownParams[] = [];
    this.templateData.forEach((template) => {
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
}
