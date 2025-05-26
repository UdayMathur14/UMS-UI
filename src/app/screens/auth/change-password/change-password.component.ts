import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { noWhitespaceValidator } from '../../../core/utilities/no-whitespace.validator';
import { name } from '@azure/msal-angular/packageMetadata';
import { PasswordDataShareService } from '../../../core/service/password-data-share.service';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  loadSpinner: boolean = false;
  passwordChangeSuccess: boolean = false;
  actionBy = '3fa85f64-5717-4562-b3fc-2c963f66afa6'; // Ideally from localStorage or auth service
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;


  constructor(
    private passwordService: PasswordDataShareService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router


  ) { }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      emailId: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        noWhitespaceValidator
      ]),
      oldPassword: new FormControl('', [Validators.required, noWhitespaceValidator]),
      newPassword: new FormControl('', [Validators.required, noWhitespaceValidator, this.passwordValidator()]),
    });
  }


  onSubmit() {
    this.loadSpinner = true;
    if (this.changePasswordForm.valid) {

      const data = {
        userEmailId: this.changePasswordForm.controls['emailId']?.value,
        oldPassword: this.changePasswordForm.controls['oldPassword']?.value,
        newPassword: this.changePasswordForm.controls['newPassword']?.value,
        otp: '',
        actionBy: this.actionBy,
      };

      // Store change password data in service before API call
      this.passwordService.setChangePasswordData({
        userEmailId: data.userEmailId,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        actionBy: this.actionBy
      });

      this.authService.changePassword(data).subscribe(
        (res) => {
          if (res.code === 200) {
            this.toastr.success(res.message, 'Success');
            this.router.navigate(['/otpValidation']);
            this.loadSpinner = false;
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );


    }
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