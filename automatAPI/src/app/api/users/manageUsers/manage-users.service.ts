import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root',
})
export class ManageUsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(
      `${environment.apiHost}${environment.apiPort}/api/users/`,
      { withCredentials: true }
    );
  }

  deleteUser(userId: number) {
    return this.http.delete(
      `${environment.apiHost}${environment.apiPort}/api/users/delete`,
      { body: { user_id: userId }, withCredentials: true }
    );
  }

  deleteAccount(){
    return this.http.delete(
      `${environment.apiHost}${environment.apiPort}/api/users/deleteAccount`,
      { withCredentials: true }
    );
  }
}
