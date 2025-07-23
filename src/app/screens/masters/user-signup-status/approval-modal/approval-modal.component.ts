import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserSignupStatusService } from '../../../../core/service/user-signup-status.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../../../core/service/role.service';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-approval-modal',
  templateUrl: './approval-modal.component.html',
  styleUrl: './approval-modal.component.scss',
})
export class ApprovalModalComponent implements OnInit {
  userType: string = '';
  userCategory: string = '';
  loadSpinner: boolean = false;
  userId: string = '';
  maxCount: number = 9000000;
  roleData: any = [];
  lookups: any = [];
  roleList: any;
  app: any;
  appData: any = [];
  apps: any[] = [];

  @Input() status: string = '';
  @Input() recordId: string = '';
  @Input() emailId: string = '';
  @Input() designation: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserSignupStatusService,
    private toastr: ToastrService,
    private router: Router,
    private roleService: RoleService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getRolesList();
    this.getLookupsList();
    this.getAppData();
  }

  getRolesList(offset: number = 0, count: number = this.maxCount) {
    const data = {
      status: '',
      roleName: '',
    };
    this.loadSpinner = true;

    this.roleService.roleData(this.userId, offset, count, data).subscribe(
      (response: any) => {
        this.roleList = response?.roles
        if (response && response.roles) {
          this.roleData = response.roles.map((role: any) => role.roleName);
        }
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getLookupsList(offset: number = 0, count: number = this.maxCount) {
    const data = {
      type: 'app',
      value: '',
      status: '',
    };
    this.loadSpinner = true;

    this.lookupService.lookupData(this.userId, offset, count, data).subscribe(
      (response: any) => {
        if (response && response.lookUps) {
          this.lookups = response.lookUps.filter((item: any) => item.status === 'Active');
        }
        this.apps = this.lookups.map((item: any) => ({
          appName: item?.value,
          id: item?.id
        }));
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }


  updateUserSignUpStatus() {
    this.loadSpinner = true;
    const roleid = this.roleList.find((item: any) => item?.roleName == this.userCategory)?.id;
    const appList = this.app.map((item: any) => ({
      id: item.id,
      name: item.appName
    }));

    const data = {
      status: this.status,
      actionBy: this.userId,
      userType: this.emailId.includes('diverseinfotech')
        ? 'Internal'
        : 'External',
      userCategory: this.userCategory,
      designation: this.designation,
      roleId: roleid,
      appList: appList
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
        this.toastr.error(error?.error?.message, 'Error');
      }
    );
  }

  getAppData() {
    this.appData = {
      singleSelection: false,
      idField: 'id',
      textField: 'appName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      itemsShowLimit: 5,
      enableSearchFilter: true,
      allowSearchFilter: true,
    };
  }
}
