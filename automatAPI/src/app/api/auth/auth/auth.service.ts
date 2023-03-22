import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  changePasswordParams,
  rememberPasswordParams,
} from 'src/app/common/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
    /* */
  }

  rememberPassword(params: rememberPasswordParams): Observable<any> {
    return null;
  }

  changePassword(params: changePasswordParams): Observable<any> {
    return null;
  }

  activateAccount(token: string): Observable<any> {
    return null;
  }

  checkToken(): Observable<any> {
    return null;
  }
}
