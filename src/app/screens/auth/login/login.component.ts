import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword: boolean = false;

  constructor(
    private router: Router,
  ) {}

  login(event: Event) {
    event.preventDefault();  // Prevent form's default submit behavior
    this.router.navigate(['/admin/dashboard']);  // Navigate to dashboard
  }

  onForgotPassword() {
    this.router.navigate(['']);
  }
}
