import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpValidationComponent } from './otp-validation/otp-validation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '../../layout/layout.module';
import { InputIntegerValidator } from '../../core/utilities/inputIntegerValidator.directive';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewPasswordComponent } from './new-password/new-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    OtpValidationComponent,
    DashboardComponent,
    InputIntegerValidator,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    NewPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    NgSelectModule
  ]
})
export class AuthModule { }
