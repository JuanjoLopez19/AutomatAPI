import { Injectable } from '@angular/core';
import { environment } from 'src/environments/env';
import { HttpClient } from '@angular/common/http';
import { techType, techUse } from 'src/app/common/enums/enums';
import {
  flaskServices,
  flaskWebApp,
} from 'src/app/common/interfaces/flaskTemplates';

@Injectable({
  providedIn: 'root',
})
export class FlaskTemplatesService {
  constructor(private http: HttpClient) {}

  createTemplateServices(
    tech: techType,
    tech_type: techUse,
    template_data: flaskServices,
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
      `${environment.apiHost}${environment.apiPort}/api/templates/flask`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
  createTemplateAppWeb(
    tech: techType,
    tech_type: techUse,
    template_data: flaskWebApp,
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
      `${environment.apiHost}${environment.apiPort}/api/templates/flask`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
}
