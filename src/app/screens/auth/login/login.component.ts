import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  userProfile: any;
  loginDisplay = false;
  emailId: string = '';
  password: string = '';
  loadSpinner: boolean = false;
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    localStorage.clear();
  }

  ngOnInit() {
    // Subscribe to MSAL events
    console.log('Login Display:', this.userProfile);
  }

  login(): void {}

  logout(): void {
    localStorage.removeItem('userProfile');
  }

  // login(event: Event) {
  //   event.preventDefault();  // Prevent form's default submit behavior
  //   this.router.navigate(['/layout']);  // Navigate to layout page
  // }

  // updateLoginDisplay(): void {
  //   const activeAccount = this.msalService.instance.getActiveAccount();
  //   this.loginDisplay = !!activeAccount; // Set to true if active account exists
  // }

  onForgotPassword() {
    this.router.navigate(['']);
  }

  onSignIn() {
    this.loadSpinner = true;
    this.authService
      .login({ username: this.emailId, password: this.password })
      .subscribe(
        (response: any) => {
          const encrRes = JSON.stringify(response);
          localStorage.setItem('data', encrRes);

          const storedData = localStorage.getItem('data');
          if (storedData) {
            const dataObj = JSON.parse(storedData);
            this.toastr.success('Logged In Successfully', response.message);
            console.log(dataObj);

            const token = dataObj.accessToken;
            const userApp = dataObj.apps.find(
              (app: any) =>
                app.name.toLowerCase().replace(/\s/g, '') ===
                'usermanagamentsystem'
            );

            if (userApp) {
              console.log(userApp.route);
              window.location.href = userApp.route;
            } else {
              const appRoute = dataObj.apps[0].route;
              const appId = dataObj.apps[0].id;
              window.location.href = `${appRoute}?data=${token}&appId=${appId}`;
            }

            this.loadSpinner = false;
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
  }
}
