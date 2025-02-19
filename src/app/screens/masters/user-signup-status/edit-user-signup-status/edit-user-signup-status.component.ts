import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserSignupStatusService } from '../../../../core/service/user-signup-status.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user-signup-status',
  templateUrl: './edit-user-signup-status.component.html',
  styleUrl: './edit-user-signup-status.component.scss'
})
export class EditUserSignupStatusComponent implements OnInit {

  userId: any;
  signupUser:any = [];
  loadSpinner: boolean = true;
  signupUserForm = new FormGroup({
      name: new FormControl('', Validators.required),
      emailId: new FormControl('', Validators.required),
      contactNo: new FormControl('', Validators.required),
      organisation: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required)
    });

  constructor(private activatedRoute: ActivatedRoute, private userService: UserSignupStatusService){}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getSignUpUserListById();
  }

  getSignUpUserListById() {
    this.userService.signupUserStatusDataById(this.userId).subscribe(
      (response: any) => {
        this.signupUserForm.patchValue({
          name: response?.name,
          emailId: response?.emailId,
          contactNo: response?.contactNo,
          organisation: response?.organisation,
          status: response?.status,
        })
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

}
