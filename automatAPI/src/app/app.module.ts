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
import { AlertComponent } from './components/basics/alert/alert.component';

// Material components
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatToolbarModule} from '@angular/material/toolbar';
import { SidebarComponent } from './components/basics/sidebar/sidebar.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';


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
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
