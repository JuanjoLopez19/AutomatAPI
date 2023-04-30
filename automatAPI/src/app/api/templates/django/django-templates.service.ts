import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { techType, techUse } from 'src/app/common/enums/enums';
import {
  djangoServices,
  djangoWebApp,
} from 'src/app/common/interfaces/djangoTemplates';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root',
})
export class DjangoTemplatesService {
  constructor(private http: HttpClient) {}

  createTemplateServices(
    tech: techType,
    tech_type: techUse,
    template_data: djangoServices,
    certFile: File | null,
    keyFile: File | null
  ) {
    const formData: FormData = new FormData();
    formData.append('tech', tech);
    formData.append('tech_type', tech_type);
    formData.append('template_data', JSON.stringify(template_data));
    if (certFile) {
      formData.append('cert', certFile, certFile.name);
    }
    if (keyFile) {
      formData.append('key', keyFile, keyFile.name);
    }
    return this.http.post(
      `${environment.apiHost}${environment.apiPort}/api/templates/django`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
  createTemplateAppWeb(
    tech: techType,
    tech_type: techUse,
    template_data: djangoWebApp,
    certFile: File | null,
    keyFile: File | null
  ) {
    const formData: FormData = new FormData();
    formData.append('tech', tech);
    formData.append('tech_type', tech_type);
    formData.append('template_data', JSON.stringify(template_data));
    if (certFile) {
      formData.append('cert', certFile, certFile.name);
    }
    if (keyFile) {
      formData.append('key', keyFile, keyFile.name);
    }
    return this.http.post(
      `${environment.apiHost}${environment.apiPort}/api/templates/django`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
}
