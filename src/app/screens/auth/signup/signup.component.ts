import { Component } from '@angular/core';
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
export class SignupComponent {
  signUpForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    emailId: new FormControl('', Validators.required),
    contactNo: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required,  Validators.minLength(6),
      this.passwordValidator()]),
    organisation: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private router: Router,   private passwordService: PasswordDataShareService,
    private toastr: ToastrService
  ){}

  onSubmit(){
    if(this.signUpForm.valid){
      const data = {
        "name": this.signUpForm.controls['userName']?.value,
        "emailId": this.signUpForm.controls['emailId']?.value,
        "contactNo": this.signUpForm.controls['contactNo']?.value,
        "password": this.signUpForm.controls['password']?.value,
        "organisation": this.signUpForm.controls['organisation']?.value,
        "otp":'',
      }
      this.passwordService.setPasswordData({
        "name": this.signUpForm.controls['userName']?.value,
        "emailId": this.signUpForm.controls['emailId']?.value,
        "contactNo": this.signUpForm.controls['contactNo']?.value,
        "password": this.signUpForm.controls['password']?.value,
        "organisation": this.signUpForm.controls['organisation']?.value,
      });

      this.authService.signUp(data).subscribe((res) =>{
        if (res.code === 200) {
          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/otpValidation'])
        }
      },error => {
        this.toastr.error(error?.error?.message, 'Error');
    })
    }

  }

  passwordValidator() {
    return (control: any) => {
      const password = control.value;
      if (!password) {
        return null;
      }

      // Minimum 10 characters
      if (password.length < 6) {
        return { minLength: true };
      }

      // Check for combination of at least 1 special, 1 uppercase, and 1 number
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
