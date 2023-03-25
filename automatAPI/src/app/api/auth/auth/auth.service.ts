import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  changePasswordParams,
  rememberPasswordParams,
} from 'src/app/common/interfaces/interfaces';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
    /* */
  }

  rememberPassword(params: rememberPasswordParams): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const queryParams = new HttpParams({
      fromObject: { email: params.email, username: params.username },
    });
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/auth/remember_password`,
      {
        params: queryParams,
        headers,
      }
    );
  }

  changePassword(params: changePasswordParams): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(
      `${environment.apiHost}${environment.apiPort}/api/auth/reset_password`,
      params,
      {
        headers,
      }
    );
  }

  activateAccount(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(
      `${environment.apiHost}${environment.apiPort}/api/auth/activate_account`,
      { token: token },
      {
        headers,
      }
    );
  }

  checkToken(): Observable<any> {
    return null;
  }
}
