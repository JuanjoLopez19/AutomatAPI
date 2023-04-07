import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { httpResponse } from 'src/app/common/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GuardService {
  constructor(private authService: AuthService, private route: Router) {}
  canActivate() {
    this.authService.checkToken().subscribe({
      next: (res: httpResponse) => {
        return true
      },
      error: (err) => {
        this.route.navigate(['/']);
        return false;
      },
    });
  }
}
