import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GuardService {
  constructor(private authService: AuthService, private route: Router) {}
  canActivate() {
    this.authService.checkToken().subscribe({
      next: (res: HttpResponse<any>) => {
        console.log(res);
        if (res.status === 200) return true;
        else return false;
      },
      error: (err) => {
        return false;
      },
    });
  }
}
