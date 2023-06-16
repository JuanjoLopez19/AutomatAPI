import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GuardService {
  constructor(private authService: AuthService, private route: Router) {}
  canActivate() {
    this.authService.checkToken().subscribe({
      next: () => {
        return true;
      },
      error: () => {
        this.route.navigate(['/']);
        return false;
      },
    });
  }
}
