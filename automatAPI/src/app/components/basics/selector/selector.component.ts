import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent {
  @Input() active: string = 'sign_in';
  @Output() onSignIn: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSignUp: EventEmitter<string> = new EventEmitter<string>();
  @Output() activeChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    /* */
  }

  manageClick(event: MouseEvent) {
    let target = (event.target as HTMLElement).id;
    if (this.active === target && this.active === 'sign_in')
      this.onSignIn.emit(target);
    else if (this.active === target && this.active === 'sign_up')
      this.onSignUp.emit(target);
    else {
      this.active = (event.target as HTMLElement).id;
      this.activeChange.emit(this.active);
    }
  }
}
