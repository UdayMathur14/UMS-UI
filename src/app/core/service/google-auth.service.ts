import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class GoogleAuthService {
    private clientId = '1085466297933-csqm5ssegal60n5puevnt6tuc9q0qffk.apps.googleusercontent.com';

    constructor(private router: Router, private ngZone: NgZone) { }

    loadGoogleSDK(): Promise<void> {
        return new Promise((resolve) => {
            if (window.google && window.google.accounts) { // Use window.google
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

        window.google.accounts.id.initialize({ // Use window.google
            client_id: this.clientId,
            callback: (response: any) => this.handleCredentialResponse(response),
        });

        window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large' }
        );
    }

    handleCredentialResponse(response: any) {
        const credential = JSON.parse(atob(response.credential.split('.')[1])); // Decode JWT
        console.log("User Info:", credential);
    
        // Store user data in localStorage
        localStorage.setItem('googleUser', JSON.stringify({
          email: credential.email,
          fullName: credential.name
        }));
    
        // Redirect to sign-up page
        setTimeout(() => this.ngZone.run(() => this.router.navigate(['/auth/signup'])), 1000);
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
}
