import { Component, Input } from '@angular/core';
import { userParams } from 'src/app/common/interfaces/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  @Input() user: userParams;

}
