import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateUserComponent } from './views/user-management/activate-user/activate-user.component';
import { RememberPasswordComponent } from './views/user-management/remember-password/remember-password.component';
import { ChangePasswordComponent } from './views/user-management/change-password/change-password.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { GuardService } from './api/auth/auth/guard/guard.service';
import { CompleteRegisterComponent } from './views/user-management/complete-register/complete-register.component';
import { LoginComponent } from './views/user-management/login/login.component';
import { RegisterComponent } from './views/user-management/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'remember_password',
    component: RememberPasswordComponent,
  },
  {
    path: 'activate_account',
    component: ActivateUserComponent,
  },
  {
    path: 'change_password',
    component: ChangePasswordComponent,
  },
  {
    path: 'complete_registration',
    component: CompleteRegisterComponent,
  },
  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [() => inject(GuardService).canActivate()],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
