import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserSignupStatusService } from '../../../../core/service/user-signup-status.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approval-modal',
  templateUrl: './approval-modal.component.html',
  styleUrl: './approval-modal.component.scss',
})
export class ApprovalModalComponent implements OnInit {
  userType: string = '';
  userCategory: string = '';
  designation: string = '';
  loadSpinner: boolean = true;
  userId: string = '';

  @Input() status: string = '';
  @Input() recordId: string = '';
  @Input() emailId: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserSignupStatusService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
  }

  updateUserSignUpStatus() {
    const data = {
      status: this.status,
      actionBy: this.userId,
      userType: this.emailId.includes('diverseinfotech')
        ? 'Internal'
        : 'External',
      userCategory: this.userCategory,
      designation: this.designation,
    };
    this.userService.signupUserStatusUpdate(this.recordId, data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success(response.message);
        this.activeModal.close();
        this.router.navigate(['masters/user-signup-status']);
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }
}
