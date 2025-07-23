import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
   clientId =
    '1085466297933-csqm5ssegal60n5puevnt6tuc9q0qffk.apps.googleusercontent.com';
  emailId: string = '';

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
  ) { }

  loadGoogleSDK(): Promise<void> {
    return new Promise((resolve) => {
      if (window.google && window.google.accounts) {
        // Use window.google
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  async initializeGoogleSignIn() {
    await this.loadGoogleSDK();

    window.google.accounts.id.initialize({
      // Use window.google
      client_id: this.clientId,
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: '280',
        shape: 'pill',
      }
    );
  }

  // startGoogleLogin() {
  //   this.loadGoogleSDK().then(() => {
  //     window.google.accounts.id.initialize({
  //       client_id: this.clientId,
  //       callback: (response: any) => this.handleCredentialResponse(response),
  //     });

  //     window.google.accounts.id.prompt(); // opens Google One Tap or popup
  //   });
  // }

  handleCredentialResponse(response: any) {
    // Store user data in localStorage
    localStorage.setItem(
      'googleUser',
      JSON.stringify({
        email: response.email,
        fullName: response.name,
      })
    );

    this.emailId = response.email;
    // Redirect to sign-up page
    setTimeout(() => this.ngZone.run(() => this.getLoginStatus()), 1000);
    // window.location.href = "/auth/signup";
  }

  // signOut() {
  //     window.google.accounts.id.disableAutoSelect(); // Use window.google
  //     localStorage.removeItem('google_token');
  //     this.router.navigate(['/login']);
  // }
  signOut() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    } else {
      console.warn('Google SDK not loaded, skipping sign out');
    }

    localStorage.removeItem('google_token');
    this.router.navigate(['']);
  }

  onSignIn() {
    this.authService.login({ username: this.emailId, password: '' }).subscribe(
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
        }
      },
      (error) => {
        this.toastr.error(error?.error?.message, 'Error');
      }
    );
  }

  getLoginStatus() {
    this.loaderService.show();
    this.authService.logInUserStatus(this.emailId).subscribe({
      next: (response: any) => {
         this.loaderService.hide();
        if (response?.code === 200) {
          this.router.navigate(['/auth/signup']);
        } else {
          this.onSignIn();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.onSignIn();
      },
    });
  }
}
