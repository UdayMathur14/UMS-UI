import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserMasterService } from '../../../../core/service/user-master.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../core/service/lookup.service';
import { RoleService } from '../../../../core/service/role.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
})
export class AddEditUserComponent {
  userId: string = '';
  isEditMode: boolean = false;
  loadSpinner: boolean = true;
  actionById: string = '';
  createUserform!: FormGroup;
  roleData: any = [];
  lookups: any = [];
  roleList: any;
  app: any;
  maxCount: number = Number.MAX_VALUE;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userMasterService: UserMasterService,
    private toastr: ToastrService,
    private roleService: RoleService,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.createUserform = this.formBuilder.group({
      name: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      userCategory: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      methodType: [''],
      app: [''],
      status: ['Active'],
      userType: [''],
    });
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.actionById = dataObj.userId;
    }
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      if (this.userId) {
        this.isEditMode = true;
        this.createUserform.get('name')?.disable();
        this.createUserform.get('emailId')?.disable();
        this.createUserform.get('contactNo')?.disable();
        this.loadUserMasterDataById();
      }
    });
    this.getRolesList();
    this.getLookupsList();
  }

  loadUserMasterDataById() {
    if (!this.userId) {
      console.log('No userId available');
      return;
    }

    this.loadSpinner = true;
    console.log('Fetching user data for ID:', this.userId);
    this.userMasterService.getUserMasterById(this.userId).subscribe({
      next: (response: any) => {
        console.log('Received user data:', response);
        if (response) {
          this.createUserform.patchValue({
            name: response.name,
            emailId: response.emailId,
            contactNo: response.contactNo,
            designation: response.designation,
            userCategory: response.userCategory,
            organisation: response.organisation,
            status: response.status,
          });
          console.log('Form after patch:', this.createUserform.value);
        }
        this.loadSpinner = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  handleSave() {
    if (!this.createUserform.valid) {
      return;
    }
    this.loadSpinner = true;
    const formData = this.createUserform.getRawValue();
    const userCategory = this.createUserform.controls['userCategory']?.value;
    const appName = this.createUserform.controls['app']?.value;
    const roleid = this.roleList.find(
      (item: any) => item?.roleName == userCategory
    )?.id;
    const appId = this.lookups.find((item: any) => item?.value == appName)?.id;
    if (this.isEditMode) {
      const updateData = {
        designation: formData.designation,
        userCategory: formData.userCategory,
        status: this.createUserform.controls['status']?.value,
        userType: formData.emailId.includes('diverseinfotech')
          ? 'Internal'
          : 'External',
        actionBy: this.actionById,
        methodType: 'Portal',
      };

      this.userMasterService
        .userMasterUpdate(this.userId, updateData)
        .subscribe({
          next: (response: any) => {
            this.toastr.success('User ' + response.message);
            this.loadSpinner = false;
            this.router.navigate(['/masters/user-master']);
          },
          error: (error) => {
            this.toastr.error(error?.error?.message, 'Error');
            this.loadSpinner = false;
          },
        });
    } else {
      const createData = {
        status: 'Active',
        name: formData.name,
        emailId: formData.emailId,
        contactNo: formData.contactNo,
        designation: formData.designation,
        userCategory: formData.userCategory,
        organisation: formData.organisation,
        userType: formData.emailId.includes('diverseinfotech')
          ? 'Internal'
          : 'External',
        createdBy: this.actionById,
        roleId: roleid,
        methodType: 'Portal',
        appList: [
          {
            id: appId,
            name: formData.app,
          },
        ],
      };

      console.log('Creating user with data:', createData);

      this.userMasterService.userMasterCreate(createData).subscribe({
        next: (response) => {
          this.loadSpinner = false;
          this.toastr.success(response.message);

          this.router.navigate(['/masters/user-master']);
        },
        error: (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        },
      });
    }
  }

  getRolesList(offset: number = 0, count: number = this.maxCount) {
    const data = {
      status: '',
      roleName: '',
    };

    this.roleService.roleData(this.userId, offset, count, data).subscribe(
      (response: any) => {
        this.roleList = response?.roles;
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

    this.lookupService.lookupData(this.userId, offset, count, data).subscribe(
      (response: any) => {
        if (response && response.lookUps) {
          this.lookups = response.lookUps.filter(
            (item: any) => item.status === 'Active'
          );
        }
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/masters/user-master']);
  }
}
