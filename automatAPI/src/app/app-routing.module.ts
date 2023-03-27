import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './views/user-management/user-management.component';
import { ActivateUserComponent } from './views/user-management/activate-user/activate-user.component';
import { RememberPasswordComponent } from './views/user-management/remember-password/remember-password.component';
import { ChangePasswordComponent } from './views/user-management/change-password/change-password.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
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
    path: 'home',
    component: DashboardComponent,
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
