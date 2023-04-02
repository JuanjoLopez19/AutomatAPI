import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GuardService implements CanActivate{
  constructor(private authService: AuthService, private route: Router) {}
  canActivate() {
    if (this.authService.checkToken()) {
      return true;
    }
    this.route.navigate(['']);
    return false;
  }
}
