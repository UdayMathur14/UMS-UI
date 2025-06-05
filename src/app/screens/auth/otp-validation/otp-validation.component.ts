import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordDataShareService } from '../../../core/service/password-data-share.service';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrl: './otp-validation.component.scss'
})
export class OtpValidationComponent {
  passwordData: any = [];
  changePasswordData: any = null; // New property for change password data
  forgetPasswordData: any = null; // New property for forget password data

  minutes: number = 3;
  seconds: number = 0;
  timerExpired: boolean = false;
  timerInterval: any;
  enableResend: boolean = false;
  otp: number | null = null;
  newPassword: string = '';
  showNewPassword: boolean = false;

  isChangePasswordFlow: boolean = false; // Flag to identify the flow
  isForgetPasswordFlow: boolean = false;
  enterOtp: boolean= false;
  enterPassword: boolean = false;
  signUpFlow: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private passwordService: PasswordDataShareService,
  ) { }

  ngOnInit(): void {
    this.passwordData = this.passwordService.getPasswordData();
    this.changePasswordData = this.passwordService.getChangePasswordData();
    this.forgetPasswordData = this.passwordService.getForgetPassword();
    this.isChangePasswordFlow = this.changePasswordData && this.changePasswordData.userEmailId;
    this.isForgetPasswordFlow = !!(this.forgetPasswordData && this.forgetPasswordData.userEmailId);
    this.signUpFlow = this.passwordData?.organisation;
    this.startTimer();
  }


  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          this.timerExpired = true;
          clearInterval(this.timerInterval);
          this.onBackSignUp();
        }
      }
      if (this.minutes < 2) this.enableResend = true;
    }, 1000);
  }

  passwordValidator(password: string): string | null {
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must include uppercase, number, and special character.';
    }
    return null;
  }

  resendOtp() {
    if (!this.enableResend) return;

    this.timerExpired = false;
    this.enableResend = false;

    if (this.isChangePasswordFlow) {
      const data = {
        userEmailId: this.changePasswordData.userEmailId,
        oldPassword: this.changePasswordData.oldPassword,
        newPassword: this.changePasswordData.newPassword,
        otp: '',
        actionBy: this.changePasswordData.actionBy,
      };
      this.authService.changePassword(data).subscribe(
        res => res.code === 200 && this.toastr.success(res.message, 'Success'),
        err => this.toastr.error(err?.error?.message, 'Error')
      );

    } else if (this.isForgetPasswordFlow) {
      const data = {
        userEmailId: this.forgetPasswordData.userEmailId,
        otp: '',
        // password: this.forgetPasswordData.password,
        password: this.newPassword // Might be empty here
      };
      this.authService.forgetPassword(data).subscribe(
        (response: any) => {
          if (response.code === 200) {
            this.toastr.success(response.message, 'Success');
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
        }
      );

    } else {
      const data = {
        "name": this.passwordData.controls?.name,
        "emailId": this.passwordData.emailId,
        "contactNo": this.passwordData.contactNo,
        "password": this.passwordData.password,
        "organisation": this.passwordData.organisation,
        "designation": this.passwordData.designation,
        "otp": '',
      };
      this.authService.signUp(data).subscribe(
        res => res.code === 200 && this.toastr.success(res.message, 'Success'), (error) => {
          this.toastr.error(error?.error?.message, 'Error');
        });
    }
  }

  submit() {
    if (this.isChangePasswordFlow) {
      const data = {
        userEmailId: this.changePasswordData.userEmailId,
        oldPassword: this.changePasswordData.oldPassword,
        newPassword: this.changePasswordData.newPassword,
        otp: this.otp?.toString() || '',
        actionBy: this.changePasswordData.actionBy,
      };
      this.authService.changePassword(data).subscribe(
        (response: any) => {
          if (response.code === 200) {
            this.toastr.success(response.message, 'Success');
             this.passwordService.clearChangePasswordData(); 
            this.router.navigate(['/auth/login']);

          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
        }
      );

    } else if (this.isForgetPasswordFlow) {
      // const validation = this.passwordValidator(this.newPassword);
      // if (validation) {
      //   this.toastr.warning(validation, 'Validation Error');
      //   return;
      // }

      const data = {
        userEmailId: this.forgetPasswordData.userEmailId,
        otp: this.otp?.toString() || '',
        // password: this.forgetPasswordData.password,
        password: ''
      };

      this.authService.forgetPassword(data).subscribe(
        res => {
          if (res.code === 200) {
            this.toastr.success(res?.message, 'Success');
             this.passwordService.clearForgetPasswordData(); 
            this.router.navigate(['/auth/new-password', this.forgetPasswordData.userEmailId]);
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
        });
    } else {
      const data = {
        "name": this.passwordData?.name,
        "emailId": this.passwordData.emailId,
        "contactNo": this.passwordData.contactNo,
        "password": this.passwordData.password,
        "organisation": this.passwordData.organisation,
        "otp": this.otp,
        "methodType": this.passwordData.methodType,
        "designation": this.passwordData?.designation
      };
      this.authService.signUp(data).subscribe(
        (response: any) => {
          if (response.code === 200) {
            this.toastr.success(response.message, 'Success');
            this.router.navigate(['/auth/login'])
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
        }
      );
    }
  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onBackSignUp() {
    if (this.isChangePasswordFlow) {
      this.router.navigate(['/auth/change-password']);
    } else if (this.isForgetPasswordFlow) {
      this.router.navigate(['/auth/forget-password']);
    } else {
      this.router.navigate(['/signup']);
    }
  }
}
