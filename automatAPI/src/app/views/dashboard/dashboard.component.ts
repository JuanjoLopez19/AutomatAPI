import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  activeView: string = 'django';
  onActiveTabChange(event: string) {
    this.activeView = event;
  }


}
