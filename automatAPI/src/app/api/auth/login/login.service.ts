import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/env';
import { loginParms } from 'src/app/common/interfaces/interfaces';
import { catchError, Observable, ObservableInput } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {
    /**/
    console.log(environment);
  }

  login(loginData: loginParms): Observable<any> {
    return this.http.post(
      `${environment.apiHost}${environment.apiPort}/api/auth/signin`,
      loginData
    );
  }

  private handleError(error: HttpErrorResponse): any {
    console.log(error);
    return error;
  }
}
