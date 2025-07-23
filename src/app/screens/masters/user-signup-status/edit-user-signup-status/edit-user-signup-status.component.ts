import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSignupStatusService } from '../../../../core/service/user-signup-status.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalModalComponent } from '../approval-modal/approval-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user-signup-status',
  templateUrl: './edit-user-signup-status.component.html',
  styleUrl: './edit-user-signup-status.component.scss',
})
export class EditUserSignupStatusComponent implements OnInit {
  signupUserId: any;
  userId: string = '';
  signupUser: any = [];
  loadSpinner: boolean = false;
  showSaveButton: boolean = false;
  emailId: string = '';
  designation: string = '';
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
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.signupUserId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSignUpUserListById();
  }

  getSignUpUserListById() {
    this.loadSpinner = true;

    this.userService.signupUserStatusDataById(this.signupUserId).subscribe(
      (response: any) => {
        this.emailId = response.emailId;
        this.designation = response?.designation;
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
    this.router.navigate(['/masters/user-signup-status'])
  }

  onChangeStatus(data: any) {
    if (data.toLowerCase() == 'rejected') {
      this.showSaveButton = true;
    } else {
      this.showSaveButton = false;
    }
    if (data.toLowerCase() == 'approved') {
      let documentModal = this.modalService.open(ApprovalModalComponent, {
        size: 'lg',
        backdrop: 'static',
        windowClass: 'modal-width',
      });
      documentModal.componentInstance.status = data;
      documentModal.componentInstance.id = data;
      documentModal.componentInstance.recordId = this.signupUserId;
      documentModal.componentInstance.emailId = this.emailId;
      documentModal.componentInstance.designation = this.designation;
      documentModal.result.then(
        (result) => {
          if (result) {
            this.router.navigate(['master/advice']);
          }
        },
      );
    }
  }

  updateUserSignUpStatus() {
    const data = {
      status: this.signupUserForm.controls['status']?.value,
      actionBy: this.userId,
      userType: '',
      userCategory: '',
      designation: '',
    };
    this.loadSpinner = true;

    this.userService.signupUserStatusUpdate(this.signupUserId, data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success(response.message);
        this.onCancel()
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }
}
