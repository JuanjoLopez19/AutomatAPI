import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ManageTemplatesService } from 'src/app/api/templates/manageTemplates/manage-templates.service';
import { TemplateField, techType, techUse } from 'src/app/common/enums/enums';
import {
  dropdownParams,
  httpResponse,
  templates,
} from 'src/app/common/interfaces/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-templates',
  templateUrl: './manage-templates.component.html',
  styleUrls: ['./manage-templates.component.scss'],
  providers: [DatePipe],
})
export class ManageTemplatesComponent implements OnInit {
  @Input() isAdmin = false;
  @Input() userId: string = null;
  @Output() editTemplate: EventEmitter<{
    id: number;
    userId: number;
    technology: techType.django | techType.express | techType.flask;
    techType: techUse.services | techUse.webApp;
  }> = new EventEmitter();
  readonly templateField: any = TemplateField;

  templateData!: templates[];
  backUpData!: templates[];
  filterForm: FormGroup;

  filterOptions: dropdownParams[] = [];
  fieldOptions: dropdownParams[] = [];

  backUp: dropdownParams;

  constructor(
    private manageTemplatesServices: ManageTemplatesService,
    private translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'T_SELECT_ONE',
        'T_TEMPLATE_ID',
        'T_TEMPLATE_USER',
        'T_TEMPLATE_NAME',
        'T_TEMPLATE_DESC',
        'T_TEMPLATE_TECH',
        'T_TEMPLATE_TECH_TYPE',
        'T_TEMPLATE_DATE',
        'T_TEMPLATE_LAST_UPDATE',
      ])
      .subscribe((res: any) => {
        this.filterOptions.push({ name: res.T_SELECT_ONE, value: undefined });
        this.backUp = { name: res.T_SELECT_ONE, value: undefined };
        const keys = Object.keys(res);
        for (let i = 1; i < keys.length; i++) {
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
    this.getTemplateData();
  }

  filterTable() {
    if (this.filterForm.invalid) return;
    const auxData: templates[] = [];
    this.backUpData.forEach((template) => {
      if (template[this.filterForm.value.field] === this.filterForm.value.value)
        auxData.push(template);
    });
    this.templateData = auxData;
  }

  filterChanged(event: any) {
    this.mapFields(event.value);
  }

  resetTable() {
    this.templateData = this.backUpData;
    this.filterForm.get('field')?.setValue(undefined);
    this.filterForm.get('value')?.reset();
    this.fieldOptions = [this.backUp];
  }

  mapFields(value: string) {
    const auxParams: dropdownParams[] = [];
    this.backUpData.forEach((template) => {
      if (value === 'date_created' || value === 'last_updated') {
        auxParams.push({
          name: this.datePipe.transform(template[value], 'medium'),
          value: template[value],
        } as dropdownParams);
      } else if (template[value]) {
        auxParams.push({
          name: template[value],
          value: template[value],
        } as dropdownParams);
      }
    });
    this.fieldOptions = [
      ...Array.from(new Set(auxParams.map((item) => JSON.stringify(item)))).map(
        (item) => JSON.parse(item)
      ),
    ];
  }

  getTemplateData() {
    this.manageTemplatesServices.getTemplates().subscribe({
      next: (res: httpResponse) => {
        if (res.status === 200) {
          this.templateData = res.data as templates[];
          this.backUpData = res.data as templates[];
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) this.router.navigate(['/']);
      },
    });
  }

  onTemplateChanged() {
    this.getTemplateData();
  }

  parseInt(value: string) {
    return Number(value);
  }

  unauth() {
    this.router.navigate(['/']);
  }

  onEditTemplate(event: {
    id: number;
    userId: number;
    technology: techType.django | techType.express | techType.flask;
    techType: techUse.services | techUse.webApp;
  }) {
    this.editTemplate.emit(event);
  }
}
