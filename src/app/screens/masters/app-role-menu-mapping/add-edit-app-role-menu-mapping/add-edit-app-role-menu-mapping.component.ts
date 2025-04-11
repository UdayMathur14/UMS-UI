import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../../../core/service/lookup.service';
import { RoleService } from '../../../../core/service/role.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppMenuMappingService } from '../../../../core/service/app-menu-mapping.service';
import { RoleAppMenuMappingService } from '../../../../core/service/role-app-menu-mapping.service';

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
  count: any = undefined;
  statusOptions = ['Active', 'Inactive'];
  menuForm: FormGroup;
  permissionDropdown = {};
  menuPermissionData: any[] = [];
  subMenuPermissionData: any[] = [];
  roleMenuId: any;
  allMenus: any;
  allSubmenus: any;
  appName: string = '';
  menuName: any;
  selectedMenuId: string = '';
  selectedMenu: any;
  menuPermissionsMap: { [key: number]: any[] } = {};
  subMenuPermissionsMap: { [key: string]: any[] } = {};
  roleMenuByIdData: any;

  constructor(
    private lookupService: LookupService,
    private roleService: RoleService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private appMenuMappingService: AppMenuMappingService,
    private roleAppMenuMappingService: RoleAppMenuMappingService
  ) {
    this.menuForm = this.formBuilder.group({
      status: ['', Validators.required],
      appName: ['', Validators.required],
      role: ['', Validators.required],
      menu: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.roleMenuId = this.route.snapshot.paramMap.get('id');
    this.getApps();
    this.getRolesList();
    this.dropdownData();
    this.getAllMenus();
    if (this.roleMenuId) {
      this.getRoleAppMenuById();
    }
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
    this.roleService
      .roleData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.roleData = response.roles;
          this.loadSpinner = false;
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
  }

  menus(): FormArray {
    return this.menuForm.get('menu') as FormArray;
  }

  subMenus(index: number): FormArray {
    return this.menus().at(index).get('subMenu') as FormArray;
  }

  addMenu() {
    const newMenu = this.formBuilder.group({
      menuName: ['', Validators.required],
      permissions: [[], Validators.required],
      subMenu: this.formBuilder.array([]),
    });
    this.menus().push(newMenu);
  }

  addSubMenu(numberOfSubMenus: any, menuIndex: number) {
    const subMenuArray = this.subMenus(menuIndex);
    if (!subMenuArray) return;

    for (let i = 0; i < numberOfSubMenus; i++) {
      const newSubMenu = this.formBuilder.group({
        menuName: ['', Validators.required],
        permissions: [[]],
      });

      subMenuArray.push(newSubMenu);
    }
  }

  dropdownData() {
    this.permissionDropdown = {
      singleSelection: false,
      idField: 'id',
      textField: 'permissionName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      itemsShowLimit: 5,
      enableSearchFilter: true,
      allowSearchFilter: true,
    };
  }

  getMenuPermissions(menuId: string, menuIndex: number) {
    const selectedMenu = this.allMenus?.find((menu: any) => menu.id === menuId);
    this.menuPermissionsMap[menuIndex] =
      selectedMenu?.permissions?.map((perm: any) => ({
        id: perm.id,
        permissionName: perm.permissionName.split('_').pop(),
      })) || [];
  }

  getSubMenuPermissions(
    selectedSubMenuId: string,
    menuIndex: number,
    subMenuIndex: number
  ) {
    const subMenuArray = this.subMenus(menuIndex);
    if (!subMenuArray) return;
    const selectedSubMenu = this.allSubmenus?.find(
      (sub: any) => sub.id === selectedSubMenuId
    );
    this.subMenuPermissionsMap[`${menuIndex}-${subMenuIndex}`] =
      selectedSubMenu?.permissions?.map((perm: any) => ({
        id: perm.id,
        permissionName: perm.permissionName.split('_').pop(),
      })) || [];
  }

  onRoleChange(data: any) {
    if (data && !this.roleMenuId && this.menus().length === 0) {
      this.addMenu();
    }
  }

 
  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  getAllMenus() {
    this.loadSpinner = true;
    const data = {
      status: 'Active',
      menuName: '',
      appName: '',
    };
    this.appMenuMappingService
      .appMenuMappingData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.allMenus = response.menus;
          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
  }

  getSelectedMenu(menuIndex?: any) {
    this.loadSpinner = true;
    const data = {
      status: 'Active',
      menuName: this.menuName || '',
      appName: this.appName || '',
    };

    this.appMenuMappingService
      .appMenuMappingData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.selectedMenu = response.menus;
          this.allSubmenus = this.selectedMenu[0]?.subMenu;

          if (this.selectedMenuId) {
            this.getMenuPermissions(this.selectedMenuId, menuIndex);
          }

          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
  }

  onAppChange(id: string) {
    this.appName = this.appsData.find((item: any) => item.id == id)?.value;
    this.getSelectedMenu();
  }

  onMenuChange(menuId: string, menuIndex: number) {
    this.selectedMenuId = menuId;
    this.menuName = this.allMenus.find(
      (item: any) => item.id == menuId
    )?.menuName;
    this.getSelectedMenu(menuIndex);
  }

  onSubmit() {
    const formValue = this.menuForm.value;
    console.log(formValue);
    const appName = this.appsData.find(
      (item: any) => item?.id == formValue.appName
    )?.value;

    const roleName = this.roleData?.find((item: any) => item?.id == formValue?.role)?.roleName
    const payload = {
      status: 'Active',
      appId: formValue?.appName,
      appName: appName,
      roleId: formValue?.role,
      roleName: roleName,
      actionBy: this.userId,
      menuDetails: formValue?.menu?.map((menuItem: any) => {
        const matchedMenu = this.allMenus.find(
          (m: any) => m.id === menuItem.menuName
        );
        const matchedSubMenus = menuItem.subMenu?.map((subMenuItem: any) => {
          const matchedSubMenu = matchedMenu?.subMenu?.find(
            (sm: any) => sm.id === subMenuItem.menuName
          );
          
          return {
            menuId: subMenuItem.menuName || '',
            menuName: matchedSubMenu?.menuName || '',
            parentMenuId: menuItem.menuName || '',
            parentMenuName: matchedMenu?.menuName || '',
            permissionDetails: subMenuItem.permissions
              ? subMenuItem.permissions.map((permission: any) => ({
                  permissionId: permission.id || '',
                  permissionName: permission.permissionName || '',
                }))
              : [],
          };
        }) || [];
    
        return {
          menuId: menuItem.menuName || '',
          menuName: matchedMenu?.menuName || '',
          subMenuLists: matchedSubMenus,
          permissionDetails: menuItem.permissions
            ? menuItem.permissions.map((permission: any) => ({
                permissionId: permission.id || '',
                permissionName: permission.permissionName || '',
              }))
            : [],
        };
      }) || [],
    };
    this.roleAppMenuMappingService.roleAppMenuCreate(payload).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success('App Menu Mapping ' + response.message);
        this.onCancel();
      },
      (error) => {
        this.toastr.error(error?.error?.message, 'Error');
        this.loadSpinner = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/masters/app-role-menu-mapping']);
  }

  getRoleAppMenuById() {
    this.loadSpinner = true;
    this.roleAppMenuMappingService.roleAppMenuDataById(this.roleMenuId).subscribe(
      (response: any) => {
        if (response) {
          this.roleMenuByIdData = response;
          console.log(this.roleMenuByIdData);
          
          this.patchMenuForm(this.roleMenuByIdData);
        }
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  mapPermissions(permissions: any[]): any[] {
    const allowedPermissions = ['ADD', 'EDIT', 'VIEW'];

    const existingPermissions = (permissions || [])
      .map((perm) => {
        const lastWord = perm.permissionName.split('_').pop()?.toUpperCase();
        return allowedPermissions.includes(lastWord || '')
          ? {
              id: perm?.id || '',
              permissionName: lastWord,
              status: perm?.status,
            }
          : null;
      })

      .filter(Boolean);
    return [...existingPermissions];
  }

  patchMenuForm(menuList: any) {
    this.menuForm.patchValue({
      appName: menuList?.appId,
      status: menuList?.status,
      role: menuList?.roleId
    });

    this.menus().clear();

    menuList?.menuDetails.forEach((menuItem: any, index: any) => {
      const menuGroup = this.formBuilder.group({
        menuName: [menuItem.menuId, Validators.required],
        permissions: [this.mapPermissions(menuItem.permissionDetails)],
        subMenu: this.formBuilder.array([]),
      });

      if (menuItem.subMenuLists && menuItem.subMenuLists.length) {
        const subMenuArray = menuGroup.get('subMenu') as FormArray;

        menuItem.subMenuLists.forEach((subMenuItem: any, subIndex: any) => {
          console.log(subMenuItem);
          
          const subMenuGroup = this.formBuilder.group({
            id: [subMenuItem.menuId],
            menuName: [subMenuItem.menuId, Validators.required],
            permissions: [this.mapPermissions(subMenuItem.permissionDetails)],
          });

          subMenuArray.push(subMenuGroup);
        });
      }

      this.menus().push(menuGroup);
    });
  }


}
