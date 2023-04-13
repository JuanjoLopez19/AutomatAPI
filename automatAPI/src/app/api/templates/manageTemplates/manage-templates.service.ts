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

  getToken(template_id: number) {
    return this.http.post(
      `${environment.apiHost}${environment.apiPort}/api/templates/getToken`,
      { template_id: template_id },
      { withCredentials: true }
    );
  }
}
