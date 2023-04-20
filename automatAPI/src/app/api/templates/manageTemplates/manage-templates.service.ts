import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root',
})
export class ManageTemplatesService {
  constructor(private http: HttpClient) {}

  getTemplates() {
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/templates/`,
      { withCredentials: true }
    );
  }

  deleteTemplate(template_id: number) {
    return this.http.delete(
      `${environment.apiHost}${environment.apiPort}/api/templates/deleteTemplate`,

      { body: { template_id: template_id }, withCredentials: true }
    );
  }

  deleteTemplateAdmin(user_id: number, template_id: number) {
    return this.http.delete(
      `${environment.apiHost}${environment.apiPort}/api/templates/deleteTemplateAdmin`,

      {
        body: { user_id: user_id, template_id: template_id },
        withCredentials: true,
      }
    );
  }

  getToken(template_id: number) {
    return this.http.post(
      `${environment.apiHost}${environment.apiPort}/api/templates/getToken`,
      { template_id: template_id },
      { withCredentials: true }
    );
  }

  getTemplateStats() {
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/templates/getTemplateStats`,
      { withCredentials: true }
    );
  }

  getUserTemplateStats() {
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/templates/getUserTemplateStats`,
      { withCredentials: true }
    );
  }

  getTemplateConfig(template_id: string) {
    return this.http.post(
      `${environment.apiHost}${environment.apiPort}/api/templates/getTemplateConfig`,
      { template_id: template_id },
      { withCredentials: true }
    );
  }

  editTemplate(
    template_id: string,
    create_temp: string,
    template_data: any,
    certFile: File | null,
    keyFile: File | null
  ) {
    const formData: FormData = new FormData();
    formData.append('template_id', template_id);
    formData.append('create_temp', create_temp);
    formData.append('template_data', JSON.stringify(template_data));

    if (certFile) {
      formData.append('cert', certFile, certFile.name);
    }

    if (keyFile) {
      formData.append('key', keyFile, keyFile.name);
    }
    return this.http.put(
      `${environment.apiHost}${environment.apiPort}/api/templates/editTemplate`,
      formData,
      { withCredentials: true }
    );
  }
}
