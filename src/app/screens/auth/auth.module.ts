import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpValidationComponent } from './otp-validation/otp-validation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '../../layout/layout.module';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    OtpValidationComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule
  ]
})
export class AuthModule { }
