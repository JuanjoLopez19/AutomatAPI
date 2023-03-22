import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { registerParams } from 'src/app/common/interfaces/interfaces';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { /* */}

  register(registerData: registerParams): Observable<any> {
    return this.http.post(
      `${environment.apiHost}${environment.apiPort}/api/auth/signup`,
      registerData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
