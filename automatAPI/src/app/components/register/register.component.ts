import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterService } from 'src/app/api/auth/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private registerService: RegisterService) {
    this.registerForm = new FormGroup(
      {
        email: new FormControl(undefined, {
          validators: [Validators.required, Validators.email],
          updateOn: 'submit',
        }),
        username: new FormControl(undefined, {
          validators: [Validators.required],
          updateOn: 'submit',
        }),
        name: new FormControl(undefined, {
          validators: [Validators.required],
          updateOn: 'submit',
        }),
        surname: new FormControl(undefined, {
          validators: [Validators.required],
          updateOn: 'submit',
        }),
        password: new FormControl(undefined, {
          validators: [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
            ),
          ],
          updateOn: 'submit',
        }),
        repeatPassword: new FormControl(undefined, {
          validators: [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
            ),
          ],
          updateOn: 'submit',
        }),
        birthdate: new FormControl(undefined, {
          validators: [
            Validators.required,
            Validators.pattern(
              '(?:(?:31(/|-|.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(/|-|.)(?:0?[13-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]d)?d{2})$|^(?:29(/|-|.)0?2\\3(?:(?:(?:1[6-9]|[2-9]d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1d|2[0-8])(/|-|.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]d)?d{2})'
            ),
          ],
          updateOn: 'submit',
        }),
      },
    );
  }

  OnRegisterSubmit(event: SubmitEvent): void {
    console.log(this.registerForm);
    if (this.registerForm.invalid) {
      return;
    } else {
      console.log('isValid');
    }
  }
}
