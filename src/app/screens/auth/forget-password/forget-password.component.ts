import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from '../../../core/utilities/no-whitespace.validator';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordDataShareService } from '../../../core/service/password-data-share.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
  loadSpinner: boolean = false;
  showNewPassword: boolean = false;

  constructor(
    private router: Router,
    private forgetPassword: AuthService,
    private toastr: ToastrService,
    private passwordService: PasswordDataShareService,
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
        noWhitespaceValidator,
        this.passwordValidator()
      ])
    });
  }

  onSubmit() {
    this.loadSpinner = true;

    if (this.forgetPasswordForm.valid) {
      const data = {
        userEmailId: this.forgetPasswordForm.controls['emailId'].value,
        otp: '', // Will be filled in the OTP screen
        password: this.forgetPasswordForm.controls['newPassword'].value
      };

      // Store this data in a service (like Change Password flow), if needed later
      this.passwordService.setForgetPassword({
        userEmailId: data.userEmailId,
        password: data.password,
      });

      this.forgetPassword.forgetPassword(data).subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.toastr.success(res.message || 'Password reset request successful', 'Success');
            this.router.navigate(['/auth/otpValidation'], {
              queryParams: { email: data.userEmailId }
            });
          } else {
            this.toastr.error(res.message || 'Failed to reset password', 'Error');
          }
          this.loadSpinner = false;
        },
        (err) => {
          this.toastr.error(err?.error?.message || 'An error occurred', 'Error');
          this.loadSpinner = false;
        }
      );
    } else {
      this.markFormGroupTouched(this.forgetPasswordForm);
      this.toastr.warning('Please fill out all required fields correctly.', 'Validation Error');
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

  passwordValidator() {
    return (control: AbstractControl) => {
      const password = control.value;
      if (!password) {
        return null;
      }

      const errors: any = {};

      // Check minimum length
      if (password.length < 6) {
        errors.minLength = true;
      }

      // Check for special character, uppercase, and number
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);

      if (!hasSpecial || !hasUpperCase || !hasNumber) {
        errors.invalidCombination = true;
      }

      // Return errors object if any errors exist, otherwise null
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
}