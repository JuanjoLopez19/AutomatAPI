import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() show: boolean;
  @Input() status: number;
  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  manageHide() {
    this.Hide.emit(false);
  }
}