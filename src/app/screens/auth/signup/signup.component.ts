import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordDataShareService } from '../../../core/service/password-data-share.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  isMicrosoftLogin = false;
  passwordLabel = 'Password';

  constructor(
    private authService: AuthService,
    private router: Router,
    private passwordService: PasswordDataShareService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // Check if user logged in via Microsoft
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const email = userProfile?.mail || '';
    const name = userProfile?.displayName || '';
    const contactNo = userProfile?.mobilePhone || '';

    this.isMicrosoftLogin = !!email; // If email exists, user logged in via Microsoft

    this.signUpForm = new FormGroup({
      userName: new FormControl(
        { value: name, disabled: this.isMicrosoftLogin },
        Validators.required
      ),
      emailId: new FormControl(
        { value: email, disabled: this.isMicrosoftLogin },
        Validators.required
      ), 
      contactNo: new FormControl(
        { value: contactNo, disabled: this.isMicrosoftLogin },
        Validators.required
      ), // Prefill & disable if Microsoft login
      organisation: new FormControl('', Validators.required),
      // password: new FormControl('', [Validators.required, Validators.minLength(6), this.passwordValidator()]),
    });

    if (this.isMicrosoftLogin) {
      this.passwordLabel = 'New Password';
    }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const data = {
        name: this.signUpForm.controls['userName']?.value,
        emailId: this.signUpForm.controls['emailId']?.value,
        contactNo: this.signUpForm.controls['contactNo']?.value,
        // password: this.signUpForm.controls['password']?.value,
        organisation: this.signUpForm.controls['organisation']?.value,
        otp: '',
      };

      this.passwordService.setPasswordData(data);

      this.authService.signUp(data).subscribe(
        (res) => {
          if (res.code === 200) {
            this.toastr.success(res.message, 'Success');
            this.router.navigate(['/otpValidation']);
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
        }
      );
    }
  }

  // passwordValidator() {
  //   return (control: any) => {
  //     const password = control.value;
  //     if (!password) {
  //       return null;
  //     }

  //     if (password.length < 6) {
  //       return { minLength: true };
  //     }

  //     const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  //     const hasUpperCase = /[A-Z]/.test(password);
  //     const hasNumber = /\d/.test(password);

  //     if (!hasSpecial || !hasUpperCase || !hasNumber) {
  //       return { invalidCombination: true };
  //     }

  //     return null;
  //   };
  // }
}
