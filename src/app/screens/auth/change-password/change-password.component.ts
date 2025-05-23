import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { noWhitespaceValidator } from '../../../core/utilities/no-whitespace.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  loadSpinner: boolean = false;
  passwordChangeSuccess: boolean = false;

  constructor() { }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      emailId: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        noWhitespaceValidator
      ]),
      oldPassword: new FormControl('', [Validators.required, noWhitespaceValidator]),
      newPassword: new FormControl('', [Validators.required, noWhitespaceValidator, this.passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required, noWhitespaceValidator])
    });

    // Add custom validator for password matching
    this.changePasswordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });

    // Also validate when new password changes
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      if (this.changePasswordForm.get('confirmPassword')?.value) {
        this.validatePasswordMatch();
      }
    });
  }

  validatePasswordMatch() {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;

    const confirmControl = this.changePasswordForm.get('confirmPassword');
    if (newPassword !== confirmPassword) {
      confirmControl?.setErrors({ ...confirmControl.errors, passwordMismatch: true });
    } else {
      // Keep other errors if any, but remove passwordMismatch
      const { passwordMismatch, ...otherErrors } = confirmControl?.errors || {};
      confirmControl?.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }
  }

  onSubmit() {
    this.loadSpinner = true;
    if (this.changePasswordForm.valid) {
      // Simulate processing delay
      setTimeout(() => {
        console.log('Password change form submitted:', {
          email: this.changePasswordForm.controls['emailId'].value,
          oldPassword: '[HIDDEN]',
          newPassword: '[HIDDEN]'
        });

        this.loadSpinner = false;
        this.passwordChangeSuccess = true;

        // Reset form
        this.changePasswordForm.reset();

        // You can add code here to show a success message to the user
        alert('Password changed successfully!');
      }, 1500);
    } else {
      this.markFormGroupTouched(this.changePasswordForm);
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
    const control = this.changePasswordForm.get(field);
    return control?.touched && (control.hasError('required') || control.hasError('whitespace')) ? true : false;
  }

  passwordValidator() {
    return (control: AbstractControl) => {
      const password = control.value;
      if (!password) {
        return null;
      }

      if (password.length < 6) {
        return { minLength: true };
      }

      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);

      if (!hasSpecial || !hasUpperCase || !hasNumber) {
        return { invalidCombination: true };
      }

      return null;
    };
  }
}