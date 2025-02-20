import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSignupStatusService } from '../../../../core/service/user-signup-status.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginComponent } from '../../../auth/login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-lookup',
  templateUrl: './add-edit-lookup.component.html',
  styleUrl: './add-edit-lookup.component.scss',
})
export class AddEditLookupComponent implements OnInit {
  userId: any;
  signupUser: any = [];
  loadSpinner: boolean = true;
  showSaveButton: boolean = true;
  emailId: string = '';
  signupUserForm = new FormGroup({
    name: new FormControl('', Validators.required),
    emailId: new FormControl('', Validators.required),
    contactNo: new FormControl('', Validators.required),
    organisation: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserSignupStatusService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSignUpUserListById();
  }

  getSignUpUserListById() {
    this.userService.signupUserStatusDataById(this.userId).subscribe(
      (response: any) => {
        this.emailId = response.emailId;
        this.signupUserForm.patchValue({
          name: response?.name,
          emailId: response?.emailId,
          contactNo: response?.contactNo,
          organisation: response?.organisation,
          status: response?.status,
        });
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/masters/lookup-signup-status']);
  }

  onChangeStatus(data: any) {
    // if (data.toLowerCase() == 'rejected') {
    //   this.showSaveButton = true;
    // } else {
    //   this.showSaveButton = false;
    // }
  }

  updateUserSignUpStatus() {
    const data = {
      status: this.signupUserForm.controls['status']?.value,
      actionBy: '1',
      userType: '',
      userCategory: '',
      designation: '',
    };
    this.userService.signupUserStatusUpdate(this.userId, data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success(response.message);
        this.onCancel();
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }
}
