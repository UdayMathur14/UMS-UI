import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  carouselImages: string[] = [
    'assets/images/carousel-1.png',
    'assets/images/carousel-2.png',
    'assets/images/carousel-3.png',
    'assets/images/carousel-4.png'
  ];

  currentImageIndex: number = 0;

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
      ])
    });

    this.startCarousel();

  }

  startCarousel() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
    }, 3000); // change image every 3 seconds
  }

  onSubmit() {
    this.loadSpinner = true;

    if (this.forgetPasswordForm.valid) {
      const data = {
        userEmailId: this.forgetPasswordForm.controls['emailId'].value,
        otp: ''
      };


      this.forgetPassword.forgetPassword(data).subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.toastr.success(res.message || 'OTP sent successfully', 'Success');
            this.passwordService.setForgetPassword({
              userEmailId: data.userEmailId,
              password: '',
            });
            this.router.navigate(['/auth/otpValidation'], {
              queryParams: { email: data.userEmailId }
            });
          } else {
            this.toastr.error(res.message || 'Failed to send OTP', 'Error');
          }
          this.loadSpinner = false;
        },
        (err) => {
          this.toastr.error(err?.error?.message || 'An error occurred', 'Error');
          this.loadSpinner = false;
        }
      );
    } else {
      this.toastr.warning('Please enter a valid email.', 'Validation Error');
      this.loadSpinner = false;
    }
  }

  isFieldRequired(field: string): boolean {
    const control = this.forgetPasswordForm.get(field);
    return !!control?.touched && (control.hasError('required') || control.hasError('whitespace'));
  }
}
