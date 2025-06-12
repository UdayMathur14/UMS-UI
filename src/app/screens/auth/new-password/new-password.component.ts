import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { noWhitespaceValidator } from '../../../core/utilities/no-whitespace.validator';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent implements OnInit {
  newPassword: string = '';
  showNewPassword: boolean = false;
  emailId: string | null = '';
  newPasswordForm!: FormGroup;
  loadSpinner: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.emailId = this.activatedRoute.snapshot.paramMap.get('email');
    this.newPasswordForm = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required,
        noWhitespaceValidator,
        this.passwordValidator(),
      ]),
    });
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

  isFieldRequired(field: string): boolean {
    const control = this.newPasswordForm.get(field);
    return control?.touched &&
      (control.hasError('required') || control.hasError('whitespace'))
      ? true
      : false;
  }

  onBackSignUp() {
    this.router.navigate(['/auth/forget-password']);
  }

  submit() {
    this.loadSpinner = true;
    const data = {
      userEmailId: this.emailId,
      otp: '',
      // password: this.forgetPasswordData.password,
      password: this.newPasswordForm.controls['newPassword']?.value,
    };

    this.authService.forgetPassword(data).subscribe(
      (res) => {
        if (res.code === 200) {
          this.toastr.success(res?.message, 'Success');
          this.router.navigate(['/auth/login']);
          this.loadSpinner = false;
        }
      },
      (error) => {
        this.toastr.error(error?.error?.message, 'Error');
      }
    );
  }
}
