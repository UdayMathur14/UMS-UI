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
  loadSpinner: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private passwordService: PasswordDataShareService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const storedProfile = localStorage.getItem('userProfile');
    let userProfile: any = {};
  
    if (storedProfile) {
      try {
        userProfile = JSON.parse(storedProfile);
      } catch (error) {
        this.toastr.warning('Failed to retrieve profile. Please try signing in again.', 'Profile Missing');
        console.error("Error parsing userProfile from localStorage:", error);
      }
    }
  
    const email = userProfile?.mail || '';
    const name = userProfile?.displayName || '';
    // const contactNo = userProfile?.mobilePhone || '';
  
    this.isMicrosoftLogin = !!email;
  
    // Fetch Google user data
    const googleUserString = localStorage.getItem('googleUser');
    let googleUser: any = null;
    let isGoogleLogin = false;
  
    if (googleUserString) {
      try {
        googleUser = JSON.parse(googleUserString);
        isGoogleLogin = true;
      } catch (error) {
        console.error("Error parsing googleUser from localStorage:", error);
      }
    }
  
    this.signUpForm = new FormGroup({
      userName: new FormControl(
        { value: name || (isGoogleLogin && googleUser ? googleUser.fullName : ''), disabled: this.isMicrosoftLogin || isGoogleLogin },
        Validators.required
      ),
      emailId: new FormControl(
        { value: email || (isGoogleLogin && googleUser ? googleUser.email : ''), disabled: this.isMicrosoftLogin || isGoogleLogin },
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
      ),
      contactNo: new FormControl('',
        Validators.required
      ),
      organisation: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required)
    });
  
    this.signUpForm.patchValue({
      Type: isGoogleLogin ? 'Google' : (this.isMicrosoftLogin ? 'Microsoft' : 'Portal'),
    });
  
    if (this.isMicrosoftLogin) {
      this.passwordLabel = 'New Password';
    }
  }
  

  onSubmit() {
    this.loadSpinner = true;
    if (this.signUpForm.valid) {
      const googleUser = localStorage.getItem('googleUser');
      const isGoogleLogin = googleUser ? true : false;
  
      const data = {
        name: this.signUpForm.controls['userName']?.value,
        emailId: this.signUpForm.controls['emailId']?.value,
        contactNo: this.signUpForm.controls['contactNo']?.value,
        organisation: this.signUpForm.controls['organisation']?.value,
        otp: '',
        // Type: this.isMicrosoftLogin ? 'Microsoft' : isGoogleLogin ? 'Google' : 'Portal',
        methodType: 'Portal',
        designation: this.signUpForm.controls['designation']?.value,
      };
  
      this.passwordService.setPasswordData(data);
  
      this.authService.signUp(data).subscribe(
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
