import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() activeTab: string = 'home';
  @Input() isAdmin: boolean = false;
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
      this.toggleActiveHeader();
    }
    this.activeTab = event;

    this.activeTabChange.emit(this.activeTab);
  }

  toggleActiveHeader(flag:boolean = false) {
    if(!flag)
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

  selectedView(): boolean{
    if(this.activeTab === 'flask' || this.activeTab === 'express' || this.activeTab === 'django'){
      this.toggleActiveHeader(true);
      return true
    }
    return false
  }
}
