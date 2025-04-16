import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../../../core/service/role.service';

@Component({
  selector: 'app-add-edit-role-master',
  templateUrl: './add-edit-role-master.component.html',
  styleUrl: './add-edit-role-master.component.scss',
})
export class AddEditRoleMasterComponent {
  userId: string = '';
  roleId: string | null = '';
  roles: any = [];
  loadSpinner: boolean = false;
  roleForm = new FormGroup({
    roleName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    roleKey: new FormControl('', Validators.required),
    status: new FormControl(''),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.roleId = this.activatedRoute.snapshot.paramMap.get('id');
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    if (this.roleId) {
      this.getRoleListById();
    }
  }

  getRoleListById() {
    this.loadSpinner = true;
    this.roleService.roleDataById(this.roleId).subscribe(
      (response: any) => {
        this.roleForm.patchValue({
          roleName: response?.roleName,
          description: response?.roleDescription,
          roleKey: response?.roleKey,
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
    this.router.navigate(['/masters/role-master']);
  }

  onChangeStatus(data: any) {
    // if (data.toLowerCase() == 'rejected') {
    //   this.showSaveButton = true;
    // } else {
    //   this.showSaveButton = false;
    // }
  }

  onSubmit() {
    this.loadSpinner = true;
    if (this.roleId) {
      const data = {
        status: this.roleForm.controls['status']?.value,
        actionBy: this.userId,
        description: this.roleForm.controls['description']?.value,
      };
      this.roleService.roleUpdate(this.roleId, data).subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success('Role ' + response.message);
          this.onCancel();
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
    } else {
      const data = {
        status: 'Active',
        actionBy: this.userId,
        roleDescription: this.roleForm.controls['description']?.value,
        roleName: this.roleForm.controls['roleName']?.value,
        roleKey: this.roleForm.controls['roleKey']?.value,
      };
      this.roleService.roleCreate(data).subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success('Role ' + response.message);
          this.onCancel();
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
    }
  }
}
