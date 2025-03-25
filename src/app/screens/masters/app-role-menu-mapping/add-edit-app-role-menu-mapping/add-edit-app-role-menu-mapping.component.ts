import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../../../core/service/lookup.service';
import { RoleService } from '../../../../core/service/role.service';

@Component({
  selector: 'app-add-edit-app-role-menu-mapping',
  templateUrl: './add-edit-app-role-menu-mapping.component.html',
  styleUrl: './add-edit-app-role-menu-mapping.component.scss',
})
export class AddEditAppRoleMenuMappingComponent implements OnInit {
  appsData: any;
  loadSpinner: boolean = true;
  userId: string = '';
  offset = 0;
  roleData: any = [];
  count: number = Number.MAX_VALUE;
  statusOptions = ['Active', 'Inactive'];

  constructor(
    private lookupService: LookupService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getApps();
    this.getRolesList();
  }

  getApps() {
    const data = {
      status: '',
      type: 'app',
      value: '',
    };
    this.lookupService
      .lookupData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.appsData = response?.lookUps;
          this.loadSpinner = false;
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
  }

  getRolesList() {
    const data = {
      status: '',
      roleName: '',
    };
    this.roleService.roleData(this.userId, this.offset, this.count, data).subscribe(
      (response: any) => {
        this.roleData = response.roles;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }
}
