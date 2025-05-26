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
  minutes: number = 3;
  seconds: number = 0;
  timerExpired: boolean = false;
  timerInterval: any;
  enableResend: boolean = false;
  otp: number | null = null;
  isChangePasswordFlow: boolean = false; // Flag to identify the flow

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private passwordService: PasswordDataShareService,
  ) {}

  ngOnInit(): void {
    this.passwordData = this.passwordService.getPasswordData();
    this.changePasswordData = this.passwordService.getChangePasswordData();
    
    // Check if this is change password flow
    this.isChangePasswordFlow = this.changePasswordData && this.changePasswordData.userEmailId;
    
    console.log('Password Data:', this.passwordData);
    console.log('Change Password Data:', this.changePasswordData);
    console.log('Is Change Password Flow:', this.isChangePasswordFlow);
    
    this.startTimer();
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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
          if (this.isChangePasswordFlow) {
            this.router.navigate(['/auth/change-password']);
          } else {
            this.router.navigate(['/signup']);
          }
        }
      }
      if (this.minutes < 2) {
        this.enableResend = true;
      }
    }, 1000);
  }

  resendOtp() {
    if (this.enableResend) {
      this.timerExpired = false;
      this.enableResend = false;
      
      if (this.isChangePasswordFlow) {
        // Resend OTP for change password
        const data = {
          userEmailId: this.changePasswordData.userEmailId,
          oldPassword: this.changePasswordData.oldPassword,
          newPassword: this.changePasswordData.newPassword,
          otp: '',
          actionBy: this.changePasswordData.actionBy,
        };
        
        this.authService.changePassword(data).subscribe(
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
        // Existing signup resend OTP logic
        const data = {
          "name": this.passwordData.controls?.name,
          "emailId": this.passwordData.emailId,
          "contactNo": this.passwordData.contactNo,
          "password": this.passwordData.password,
          "organisation": this.passwordData.organisation,
          "designation": this.passwordData.designation,
          "otp":'',
        };
        this.authService.signUp(data).subscribe(
          (response: any) => {
            if (response.code === 200) {
              this.toastr.success(response.message, 'Success');
            }
          },
          (error) => {
            this.toastr.error(error?.error?.message, 'Error');
          }
        );
      }
    }
  }

  submit() {
    if (this.isChangePasswordFlow) {
      // Submit OTP for change password
      console.log('Change Password Data:', this.changePasswordData);
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
            this.router.navigate(['/auth/login']);
          }
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
        }
      );
    } else {
      // Existing signup OTP verification logic
      console.log(this.passwordData);
      const data = {
        "name": this.passwordData?.name,
        "emailId": this.passwordData.emailId,
        "contactNo": this.passwordData.contactNo,
        "password": this.passwordData.password,
        "organisation": this.passwordData.organisation,
        "otp":this.otp,
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
    } else {
      this.router.navigate(['/signup']);
    }
  }
}