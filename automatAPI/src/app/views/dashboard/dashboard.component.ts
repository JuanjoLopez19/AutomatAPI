import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  activeView: string = 'django';
  user: userParams;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      const aux = navigation.extras.state as { data: userParams };
      if (aux) this.user = aux.data;
      else this.router.navigate(['/']);
    } else this.router.navigate(['/']);
  }
  onActiveTabChange(event: string) {
    this.activeView = event;
  }
}
