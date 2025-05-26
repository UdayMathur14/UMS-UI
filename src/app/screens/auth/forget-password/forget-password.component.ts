import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from '../../../core/utilities/no-whitespace.validator';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
  loadSpinner: boolean = false;

  constructor(
    private router: Router,
    private forgetPassword: AuthService
  ) { }

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
      const payload = {
        userEmailId: this.forgetPasswordForm.controls['emailId'].value,
        otp: "", // Will be filled later in OTP screen
        password: this.forgetPasswordForm.controls['newPassword'].value
      };

      this.forgetPassword.forgetPassword(payload).subscribe({
        next: (res: any) => {
          this.loadSpinner = false;
          // Assuming success response means continue to OTP validation
          this.router.navigate(['/auth/otpValidation'], {
            queryParams: { email: payload.userEmailId }
          });
        },
        error: (err) => {
          this.loadSpinner = false;
          console.error('Forget password API failed', err);
          // Optionally show a toast/snackbar with error message
        }
      });
    } else {
      this.markFormGroupTouched(this.forgetPasswordForm);
      this.loadSpinner = false;
    }
  }

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