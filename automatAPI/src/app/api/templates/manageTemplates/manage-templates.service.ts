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
}
