import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() show: boolean;
  @Input() status: number;
  @Input() message: string;
  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  translatedMessage = '';

  manageHide() {
    this.Hide.emit(false);
  }

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get(this.message).subscribe((res: string) => {
      this.translatedMessage = res;
    });
  }
}
