import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { techType, techUse } from 'src/app/common/enums/enums';
import {
  expressServices,
  expressWebApp,
} from 'src/app/common/interfaces/expressTemplates';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root',
})
export class ExpressTemplatesService {
  constructor(private http: HttpClient) {}

  createTemplateServices(
    tech: techType,
    tech_type: techUse,
    template_data: expressServices,
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
      `${environment.apiHost}${environment.apiPort}/api/templates/express`,
      formData,
      {
        withCredentials: true,
      }
    );
  }

  createTemplateAppWeb(
    tech: techType,
    tech_type: techUse,
    template_data: expressWebApp,
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
      `${environment.apiHost}${environment.apiPort}/api/templates/express`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
}
