import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  activeTab: string = 'home';
  state: number = -1;

  @Output() activeTabChange: EventEmitter<string> = new EventEmitter<string>();

  toggleActive(event: string) {
    if (
      this.state === 0 &&
      event !== 'flask' &&
      event !== 'express' &&
      event !== 'django'
    ) {
      this.setState(-1);
      this.toggleActiveHeader(null);
    }
    this.activeTab = event;

    this.activeTabChange.emit(this.activeTab);
  }

  toggleActiveHeader(event: MouseEvent) {
    this.activeTab = '';
    const target = document.getElementsByName('header');
    const targets = document.getElementsByName('text');
    target[0].classList.toggle('selected');
    targets.forEach((element) => {
      element.classList.toggle('selected-icon');
    });
  }

  setState(stateNumb: number) {
    this.state = stateNumb;
  }
}
