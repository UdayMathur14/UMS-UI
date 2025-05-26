import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from '../../../core/utilities/no-whitespace.validator';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
  loadSpinner: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.forgetPasswordForm = new FormGroup({
      emailId: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        noWhitespaceValidator
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        noWhitespaceValidator
      ])
    });
  }


  onSubmit() {
    this.loadSpinner = true;
    if (this.forgetPasswordForm.valid) {
      // Simulate processing delay
      setTimeout(() => {
        console.log('Forget password form submitted:', {
          email: this.forgetPasswordForm.controls['emailId'].value
        });

        this.loadSpinner = false;

        // Navigate to OTP validation component
        this.router.navigate(['/auth/otp-validation'], {
          queryParams: { email: this.forgetPasswordForm.controls['emailId'].value }
        });

        // You can also store the email in a service if needed for the OTP component
        // this.authService.setEmailForOtp(this.forgetPasswordForm.controls['emailId'].value);
      }, 1500);
    } else {
      this.markFormGroupTouched(this.forgetPasswordForm);
      this.loadSpinner = false;
    }
  }

  // Helper method to mark all controls as touched to trigger validation messages
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldRequired(field: string): boolean {
    const control = this.forgetPasswordForm.get(field);
    return control?.touched && (control.hasError('required') || control.hasError('whitespace')) ? true : false;
  }
}