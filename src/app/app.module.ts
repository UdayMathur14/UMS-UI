import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './screens/auth/login/login.component';
import { SignupComponent } from './screens/auth/signup/signup.component';
import { AuthModule } from './screens/auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    // LoginComponent,
    // SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
