import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  faUser = faUser;
  constructor() { /* */ }
}
