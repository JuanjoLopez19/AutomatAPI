import {
  Component,
  EventEmitter,

  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { flaskEndpointTemplate } from 'src/app/common/interfaces/flaskTemplates';

@Component({
  selector: 'app-endpoint-modal',
  templateUrl: './endpoint-modal.component.html',
  styleUrls: ['./endpoint-modal.component.scss'],
})
export class EndpointModalComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() Hide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() endpointAdded: EventEmitter<flaskEndpointTemplate> =
    new EventEmitter<flaskEndpointTemplate>();

  addEndpointFormControl: FormGroup;
  success: boolean = false;
  manageHide() {
    this.Hide.emit(false);
  }

  ngOnInit(): void {
    this.addEndpointFormControl = new FormGroup({
      endpoint_name: new FormControl(''),
      endpoint_comment: new FormControl(''),
      endpoint_url: new FormControl(''),
      methods: new FormGroup({
        get_m: new FormControl(true),
        post: new FormControl(false),
        put: new FormControl(false),
        del: new FormControl(false),
      }),
    });
  }

  closeModal() {
    const endpoint: flaskEndpointTemplate = {
      endpoint_name: this.addEndpointFormControl.get('endpoint_name').value,
      endpoint_comment:
        this.addEndpointFormControl.get('endpoint_comment').value,
      endpoint_url: this.addEndpointFormControl.get('endpoint_url').value,
      methods: {
        get_m: this.addEndpointFormControl.get('methods').get('get_m').value
          ? 'yes'
          : 'no',
        post: this.addEndpointFormControl.get('methods').get('post').value
          ? 'yes'
          : 'no',
        put: this.addEndpointFormControl.get('methods').get('put').value
          ? 'yes'
          : 'no',
        del: this.addEndpointFormControl.get('methods').get('del').value
          ? 'yes'
          : 'no',
      },
    };
    this.endpointAdded.emit(endpoint);

    this.show = false;
  }
}
