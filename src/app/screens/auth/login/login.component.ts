import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { GoogleAuthService } from '../../../core/service/google-auth.service';
import { LoaderService } from '../../../core/service/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  showPassword: boolean = false;
  emailId: string = '';
  password: string = '';
  loadSpinner: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private googleAuthService: GoogleAuthService,
    private loaderService: LoaderService
  ) {
    localStorage.clear();
  }

  ngOnInit() {
    // Loader status change
    this.loaderService.loading$.subscribe((status) => {
      this.loadSpinner = status;
    });

    // Google redirect check
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        this.fetchGoogleUserInfo(accessToken);
      }
    }
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
          const firstAttempt = response?.firstAttempt;
          localStorage.setItem('data', resData);

          this.toastr.success('Logged In Successfully', response.message);
          const token = response?.accessToken;

          if (response.apps?.length === 1 && !firstAttempt) {
            const app = response.apps[0];
            window.location.href = `${app.route}?data=${token}&appId=${app.id}`;
          } else if (!firstAttempt) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/change-password']);
          }

          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(error?.error?.message || 'Login failed', 'Error');
          this.loadSpinner = false;
        }
      );
  }

  // 🔹 Google Login
  signInWithGoogle() {
    this.loadSpinner = true;
    this.googleAuthService.loadGoogleSDK().then(() => {
      window.google.accounts.id.initialize({
        client_id: this.googleAuthService.clientId,
        callback: (response: any) => {
          if (response?.credential) {
            this.googleAuthService.handleCredentialResponse(response);
          } else {
            this.toastr.error('Google sign-in failed. Please try again.');
          }
          this.loadSpinner = false;
        },
      });

      this.redirectToGoogleOAuth();
    });
  }

  redirectToGoogleOAuth() {
    const clientId = this.googleAuthService.clientId;
    const redirectUri = encodeURIComponent('/auth/login');
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile&prompt=select_account`;
    window.location.href = oauthUrl;
  }

  fetchGoogleUserInfo(token: string) {
    this.http
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe((user: any) => {
        this.googleAuthService.handleCredentialResponse(user);
      });
  }

  onForgotPassword() {
    this.router.navigate(['forget-password']);
  }

  onChangePassword() {
    this.router.navigate(['change-password']);
  }
}
