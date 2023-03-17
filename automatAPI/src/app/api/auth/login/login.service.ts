import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/env';
import { loginParms } from 'src/app/common/interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {
    /**/
    console.log(environment)
  }

  login(loginData: loginParms): Observable<any> {
    return this.http.post(`${environment.apiHost}${environment.apiPort}/api/auth/sigin`, loginData);
  }
}
