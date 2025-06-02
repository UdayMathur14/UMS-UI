import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, EventMessage, EventType } from '@azure/msal-browser';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { GoogleAuthService } from '../../../core/service/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, AfterViewInit {
  showPassword: boolean = false;
  userProfile: any;
  loginDisplay = false;
  emailId: string = '';
  password: string = '';
  loadSpinner: boolean = false;
  userEmail: string = '';

  constructor(
    private router: Router,
    private msalService: MsalService,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private googleAuthService: GoogleAuthService
  ) {
    localStorage.clear();
  }

  ngOnInit() {
    // Subscribe to MSAL events
    this.msalService.instance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const account = event.payload as AccountInfo;
        this.msalService.instance.setActiveAccount(account);
        this.updateLoginDisplay();
        this.fetchUserProfile();

        this.loadSpinner = true;

        // Redirect after successful Microsoft login
        setTimeout(() => {
          this.loadSpinner = false;
          const userProfile = localStorage.getItem('userProfile');
          if (!userProfile) {
            this.toastr.warning(
              'Failed to retrieve profile. Please try signing in again.',
              'Profile Missing'
            );
            console.log('called');

            this.logout(); // Clear state and redirect to login
          } else {
            this.getLoginStatus();
          }
        }, 3000);
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        this.updateLoginDisplay();
        this.userProfile = null;
      }
    });

    this.checkLoginStatus();
  }

  ngAfterViewInit() {
    this.googleAuthService.initializeGoogleSignIn();
  }

  // 🔹 Manual Login
  onSignIn() {
    this.loadSpinner = true;
    this.authService
      .login({ username: this.emailId, password: this.password })
      .subscribe(
        (response: any) => {
          const resData = JSON.stringify(response);
          localStorage.setItem('data', resData);
          const storedData = localStorage.getItem('data');
          if (storedData) {
            const dataObj = JSON.parse(storedData);
            this.toastr.success('Logged In Successfully', response.message);
            const token = dataObj.accessToken;
            const userApp = dataObj.apps.find(
              (app: any) =>
                app.name.toLowerCase().replace(/\s/g, '') ===
                'usermanagamentsystem'
            );
            if (dataObj.apps.length == 1 && userApp) {
              window.location.href = userApp.route;
              // this.router.navigate(['/masters'])
            } else if (dataObj.apps.length == 1 && !userApp) {
              const appRoute = dataObj.apps[0].route;
              const appId = dataObj.apps[0].id;
              window.location.href = `${appRoute}?data=${token}&appId=${appId}`;
            } else {
              this.router.navigate(['/dashboard']);
            }

            // if (userApp) {
            //   // window.location.href = userApp.route;
            //   this.router.navigate(['/masters'])
            // } else {
            //   const appRoute = dataObj.apps[0].route;
            //   const appId = dataObj.apps[0].id;
            //   window.location.href = `${appRoute}?data=${token}&appId=${appId}`;
            // }

            this.loadSpinner = false;
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
  }

  // 🔹 Microsoft Login
  loginWithMicrosoft(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.msalService.logoutRedirect({
      // postLogoutRedirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: window.location.origin,
    });
    localStorage.removeItem('userProfile');
  }

  checkLoginStatus(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      const activeAccount =
        this.msalService.instance.getActiveAccount() || accounts[0];
      this.msalService.instance.setActiveAccount(activeAccount);
      this.updateLoginDisplay();
      this.fetchUserProfile();
    } else {
      this.loginDisplay = false;
    }
  }

  updateLoginDisplay(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    this.loginDisplay = !!activeAccount; // Set to true if active account exists
  }

  fetchUserProfile(): void {
    const graphEndpoint = 'https://graph.microsoft.com/v1.0/me';
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount) {
      console.error('No active account found.');
      return;
    }

    this.msalService.instance
      .acquireTokenSilent({
        account: activeAccount,
        scopes: ['User.Read'],
      })
      .then((response) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${response.accessToken}`,
        });

        this.http.get(graphEndpoint, { headers }).subscribe({
          next: (profile) => {
            this.userProfile = profile;
            this.emailId = this.userProfile?.mail

            localStorage.setItem(
              'userProfile',
              JSON.stringify(this.userProfile)
            );
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
          },
        });
      })
      .catch((error) => {
        // console.error('Error acquiring token:', error);
        console.warn(
          'Silent token acquisition failed. Trying interactive redirect...'
        );
        console.warn(
          'Silent token acquisition failed. Trying interactive redirect...'
        );
        this.msalService.instance.acquireTokenRedirect({
          scopes: ['User.Read'],
        });
      });
  }

  onForgotPassword() {
    this.router.navigate(['forget-password']);
  }

  onChangePassword() {
    this.router.navigate(['change-password']);
  }

  getLoginStatus() {
    this.loadSpinner = true;
    this.authService.logInUserStatus(this.emailId).subscribe({
      next: (response: any) => {
        if (response?.code === 200) {
          this.router.navigate(['/auth/signup']);
        } else {
          this.onSignIn();
        }
        this.loadSpinner = false;
      },
      error: (err) => {
        this.onSignIn();
        this.loadSpinner = false;
      }
    });
  }

}
