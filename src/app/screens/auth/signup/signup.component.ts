import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordDataShareService } from '../../../core/service/password-data-share.service';
import { ToastrService } from 'ngx-toastr';
import { noWhitespaceValidator } from '../../../core/utilities/no-whitespace.validator';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  isMicrosoftLogin = false;
  passwordLabel = 'Password';
  loadSpinner: boolean = false;
  loginType: string = 'Portal';
  count: number = 900000;
  organisations: any[] = [];
  filteredOrganisations: any[] = [];
  hasFetchedOrganisations = false;
  lastSearchTerm: string = '';

  carouselImages: string[] = [
    'assets/images/carousel-1.png',
    'assets/images/carousel-2.png',
    'assets/images/carousel-3.png',
    'assets/images/carousel-4.png'
  ];

  currentImageIndex: number = 0;

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
        this.toastr.warning(
          'Failed to retrieve profile. Please try signing in again.',
          'Profile Missing'
        );
        console.error('Error parsing userProfile from localStorage:', error);
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
        console.error('Error parsing googleUser from localStorage:', error);
      }
    }

    this.signUpForm = new FormGroup({
      userName: new FormControl(
        {
          value:
            name || (isGoogleLogin && googleUser ? googleUser.fullName : ''),
          disabled: this.isMicrosoftLogin || isGoogleLogin,
        },
        [Validators.required, noWhitespaceValidator]
      ),
      emailId: new FormControl(
        {
          value: email || (isGoogleLogin && googleUser ? googleUser.email : ''),
          disabled: this.isMicrosoftLogin || isGoogleLogin,
        },
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ), noWhitespaceValidator
        ]
      ),
      contactNo: new FormControl('', [Validators.required, noWhitespaceValidator]),
      organisation: new FormControl(null, [Validators.required, noWhitespaceValidator]),
      designation: new FormControl('', [Validators.required, noWhitespaceValidator]),
      methodType: new FormControl(''),
    });

    if (isGoogleLogin) {
      this.loginType = 'Google';
    } else if (this.isMicrosoftLogin) {
      this.loginType = 'Microsoft';
    }

    this.signUpForm.patchValue({ methodType: this.loginType });

    if (this.isMicrosoftLogin) {
      this.passwordLabel = 'New Password';
    }

    this.startCarousel();

  }

  startCarousel() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
    }, 3000); // change image every 3 seconds
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
        methodType: this.signUpForm.controls['methodType']?.value,
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

  isFieldRequired(field: string): any {
    const control = this.signUpForm.get(field);
    return control?.touched && (control.hasError('required') || control.hasError('whitespace'));
  }

  isEmailInvalid(): any {
    const control = this.signUpForm.get('emailId');
    return control?.touched && (control.hasError('email') || control.hasError('pattern'));
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


  onSearchOrganisation(event: { term: string; items: any[] }) {
    const term = event.term;
    console.log('Search term:', term);

    if (term && term.length >= 2) {
      if (!this.hasFetchedOrganisations) {
        this.getOrganisationList();
      } else {
        this.filterOrganisations(term);
      }
    } else {
      this.filteredOrganisations = [];
    }
  }


  getOrganisationList(offset: number = 0, count: number = this.count) {
    this.loadSpinner = true;

    this.authService.organisationData({}, offset, count).subscribe(
      (response: any) => {
        this.organisations = response.registeredOrganisation || [];
        console.log(this.organisations);

        this.hasFetchedOrganisations = true;
        this.loadSpinner = false;
        this.filterOrganisations(this.lastSearchTerm);
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  filterOrganisations(term: string) {
    this.filteredOrganisations = this.organisations
      .filter((org: any) =>
        org.organisation.toLowerCase().includes(term.toLowerCase())
      );

    const staticOrg = { organisation: 'Diverse Infotech Private Limited' };
    const exists = this.filteredOrganisations.some(
      (org) => org.organisation === staticOrg.organisation
    );

    if (!exists) {
      this.filteredOrganisations.push(staticOrg);
    }
  }
}
