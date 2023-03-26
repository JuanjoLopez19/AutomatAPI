import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  constructor(private http: HttpClient) {
    /* */
  }

  loginGoogle(): Observable<any> {
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/auth/google_login`
    );
  }

  loginFacebook(): Observable<any> {
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/auth/facebook_login`
    );
  }

  loginGithub(): Observable<any> {
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/auth/github_login`
    );
  }
}
