import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo, EventMessage, EventType } from '@azure/msal-browser';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  userProfile: any;
  loginDisplay = false;
  emailId: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private msalService: MsalService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Subscribe to MSAL events
    this.msalService.instance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const account = event.payload as AccountInfo;
        this.msalService.instance.setActiveAccount(account);
        this.updateLoginDisplay();
        this.fetchUserProfile();

        // Redirect to admin/dashboard after login success
        this.router.navigate(['/auth/signup']);
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        this.updateLoginDisplay();
        this.userProfile = null;
      }
    });

    this.checkLoginStatus();
    console.log('Login Display:', this.userProfile);

  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200',
    });
    localStorage.removeItem('userProfile');
  }



  // login(event: Event) {
  //   event.preventDefault();  // Prevent form's default submit behavior
  //   this.router.navigate(['/layout']);  // Navigate to layout page
  // }

  checkLoginStatus(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      const activeAccount = this.msalService.instance.getActiveAccount() || accounts[0];
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
            console.log('User Profile:', this.userProfile);
            localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
          },
        });
      })
      .catch((error) => {
        console.error('Error acquiring token:', error);
      });
  }

  onForgotPassword() {
    this.router.navigate(['']);
  }

  onSignIn(){
    this.authService.login({ username: this.emailId, password: this.password }).subscribe(
      (response: any) => {
        const encrRes = btoa(JSON.stringify(response));
        localStorage.setItem('data', atob(encrRes));
        this.router.navigate(['/masters'])
      },
      (error) => {
      }
    );
  }
}
