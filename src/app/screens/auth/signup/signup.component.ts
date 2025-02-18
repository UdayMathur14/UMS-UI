import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm = new FormGroup({
    userName: new FormControl(''),
    emailId: new FormControl(''),
    contactNo: new FormControl(''),
    password: new FormControl(''),
    organisation: new FormControl(''),
  });

  constructor(private authService: AuthService){}

  onSubmit(){
    const data = {
        "name": this.signUpForm.controls['userName']?.value,
        "emailId": this.signUpForm.controls['emailId']?.value,
        "contactNo": this.signUpForm.controls['contactNo']?.value,
        "password": this.signUpForm.controls['password']?.value,
        "organisation": this.signUpForm.controls['organisation']?.value,
      }

      this.authService.signUp(data).subscribe((res) =>{
        console.log(res)
      })
  }
}
