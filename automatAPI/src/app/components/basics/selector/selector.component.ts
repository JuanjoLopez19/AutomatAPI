import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent {
  @Input() active: string;
  @Output() SignIn: EventEmitter<string> = new EventEmitter<string>();
  @Output() SignUp: EventEmitter<string> = new EventEmitter<string>();
  @Output() activeChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    /* */
  }

  manageClick(event: MouseEvent, target: number) {
    if (!target) {
      this.active = 'sign_in';
      this.activeChange.emit(this.active);
    } else {
      this.active = 'sign_up';
      this.activeChange.emit(this.active);
    }
  }
}
