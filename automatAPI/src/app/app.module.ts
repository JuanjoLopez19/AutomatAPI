import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Custom components and views
import { UserManagementComponent } from './views/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { SelectorComponent } from './components/basics/selector/selector.component';
import { ActivateUserComponent } from './views/user-management/activate-user/activate-user.component';
import { RememberPasswordComponent } from './views/user-management/remember-password/remember-password.component';
import { ChangePasswordComponent } from './views/user-management/change-password/change-password.component';
import { AlertComponent } from './components/basics/alert/alert.component';
import { HomeComponent } from './components/dashboard/content/home/home.component';
import { FlaskTemplatesComponent } from './components/dashboard/content/flask-templates/flask-templates.component';
import { ExpressTemplatesComponent } from './components/dashboard/content/express-templates/express-templates.component';
import { DjangoTemplatesComponent } from './components/dashboard/content/django-templates/django-templates.component';
import { ManageTemplatesComponent } from './components/dashboard/content/manage-templates/manage-templates.component';
import { ManageUsersComponent } from './components/dashboard/content/manage-users/manage-users.component';
import { EndpointModalComponent } from './components/basics/endpoint-modal/endpoint-modal.component';

// NG Prime components
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';

// Material components
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from './components/dashboard/header/header.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { SubAppModalComponent } from './components/basics/sub-app-modal/sub-app-modal.component';
import { ModelModalComponent } from './components/basics/model-modal/model-modal.component';
import { CompleteRegisterComponent } from './views/user-management/complete-register/complete-register.component';








// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    UserManagementComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    SelectorComponent,
    ActivateUserComponent,
    RememberPasswordComponent,
    ChangePasswordComponent,
    AlertComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    FlaskTemplatesComponent,
    ExpressTemplatesComponent,
    DjangoTemplatesComponent,
    ManageTemplatesComponent,
    ManageUsersComponent,
    EndpointModalComponent,
    ProfileComponent,
    SubAppModalComponent,
    ModelModalComponent,
    CompleteRegisterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    InputTextModule,
    FontAwesomeModule,
    PasswordModule,
    CalendarModule,
    RadioButtonModule,
    DividerModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RippleModule,
    BrowserAnimationsModule,
    DialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MenuModule,
    MatExpansionModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    InputNumberModule,
    DropdownModule,
    TableModule,
    CheckboxModule,
    InputTextareaModule,
    AvatarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
