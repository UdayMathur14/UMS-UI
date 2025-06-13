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
  selectedRole: string = '';
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

  maxCount: number = 9000000; // Maximum count for pagination
  isUpdateMode: boolean = false;

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
    console.log(this.roleMenuId, "ROUTING ID");

    this.getApps();
    this.getRolesList();
    this.dropdownData();
    this.getAllMenus();
    if (this.roleMenuId) {
      this.isUpdateMode = true;
      this.getRoleAppMenuById();
      setTimeout(() => {
        console.log(this.menuName, "MENU NAME");
        console.log(this.allMenus, "ALL MENUS");
        this.getAllMenus();
      }, 2000);
    }

    //     if (this.roleMenuId) {
    //   this.isUpdateMode = true;
    // }
    // this.getAllMenus(); 



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
    console.log(selectedMenu, "selectedMenu");//showing only after dropdown changes

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
      this.selectedRole = data
    }
  }


  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  extractPermissionType(permissionName: string): string {
    const parts = permissionName.split('_');
    return parts.length > 1 ? parts[parts.length - 1] : "";
  }

  // getAllMenus() {
  //   // debugger;
  //   const menuPermissions: string[] = [];
  //   const uniquePermissions = new Set<string>();
  //   this.loadSpinner = true;
  //   const data = {
  //     status: 'Active',
  //     menuName: this.menuName,
  //     appName: ""
  //   };
  //   console.log(this.menuName, "MENU NAME");

  //   this.appMenuMappingService
  //     .appMenuMappingData(this.userId, this.offset, this.count, data)
  //     .subscribe(
  //       (response: any) => {
  //         this.allMenus = response.menus;
  //         console.log(this.allMenus, "permissionName");

  //         this.allMenus.forEach((menu: any) => {
  //           // Handle top-level menu permissions
  //           if (menu.permissions) {
  //             menu.permissions.forEach((perm: any) => {
  //               const type = this.extractPermissionType(perm.permissionName);
  //               if (type) uniquePermissions.add(type);
  //             });
  //           }
  //         });
  //         menuPermissions.push(...Array.from(uniquePermissions));
  //         console.log(menuPermissions, "menuPermissions");



  //         this.loadSpinner = false;
  //       },
  //       (error) => {
  //         this.toastr.error(error?.error?.message, 'Error');
  //         this.loadSpinner = false;
  //       }
  //     );
  // }

  getAllMenus() {
    const data = {
      status: 'Active',
      menuName: this.menuName,
      appName: ""
    };

    this.loadSpinner = true;

    this.appMenuMappingService
      .appMenuMappingData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.allMenus = response.menus;
          this.loadSpinner = false;

          // ✅ Wait until menus are loaded before calling patch
          if (this.isUpdateMode && this.roleMenuByIdData) {
            this.patchMenuForm(this.roleMenuByIdData);
          }
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
    this.getAllMenus();
  }

  onMenuChange(menuId: string, menuIndex: number) {
    this.selectedMenuId = menuId;
    this.menuName = this.allMenus.find(
      (item: any) => item.id == menuId
    )?.menuName;
    console.log(this.menuName, "right place menu name");

    this.getSelectedMenu(menuIndex);
  }

  // onSubmit() {
  //     const formValue = this.menuForm.value;
  //     console.log("FORM VALUE",formValue);
  //     const appName = this.appsData.find(
  //       (item: any) => item?.id == formValue.appName
  //     )?.value;

  //     const roleName = this.roleData?.find((item: any) => item?.id == formValue?.role)?.roleName
  //     const payload = {
  //       status: 'Active',
  //       appId: formValue?.appName,
  //       appName: appName,
  //       roleId: formValue?.role,
  //       roleName: roleName,
  //       actionBy: this.userId,
  //       menuDetails: formValue?.menu?.map((menuItem: any) => {
  //         const matchedMenu = this.allMenus.find(
  //           (m: any) => m.id === menuItem.menuName
  //         );
  //         const matchedSubMenus = menuItem.subMenu?.map((subMenuItem: any) => {
  //           const matchedSubMenu = matchedMenu?.subMenu?.find(
  //             (sm: any) => sm.id === subMenuItem.menuName
  //           );

  //           return {
  //             menuId: subMenuItem.menuName || '',
  //             menuName: matchedSubMenu?.menuName || '',
  //             parentMenuId: menuItem.menuName || '',
  //             parentMenuName: matchedMenu?.menuName || '',
  //             permissionDetails: subMenuItem.permissions
  //               ? subMenuItem.permissions.map((permission: any) => ({
  //                 permissionId: permission.id || '',
  //                 permissionName: permission.permissionName || '',
  //               }))
  //               : [],
  //           };
  //         }) || [];

  //         return {
  //           menuId: menuItem.menuName || '',
  //           menuName: matchedMenu?.menuName || '',
  //           subMenuLists: matchedSubMenus,
  //           permissionDetails: menuItem.permissions
  //             ? menuItem.permissions.map((permission: any) => ({
  //               permissionId: permission.id || '',
  //               permissionName: permission.permissionName || '',
  //             }))
  //             : [],
  //         };
  //       }) || [],
  //     };
  //     this.roleAppMenuMappingService.roleAppMenuCreate(payload).subscribe(
  //       (response: any) => {
  //         this.loadSpinner = false;
  //         this.toastr.success('App Menu Mapping ' + response.message);
  //         this.onCancel();
  //       },
  //       (error) => {
  //         this.toastr.error(error?.error?.message, 'Error');
  //         this.loadSpinner = false;
  //       }
  //     );
  // }

  //my code --->

  onSubmit() {

    const formData = this.menuForm.value;
    const allowedPermissions = ['ADD', 'EDIT', 'VIEW'];

    const menuDetail = formData.menu.map((menuItem: any, menuIndex: number) => {
      const matchedMenu = this.allMenus.find((m: any) => m.id === menuItem.menuName);
      const parentPermissions = menuItem.permissions.map((perm: any) => ({
        permissionId: perm.id,
        permissionName: perm.permissionName,
        status: 'Active',
      }));

      const subMenuLists = (menuItem.subMenu || []).map((subMenuItem: any) => {
        const matchedSub = matchedMenu?.subMenu?.find((s: any) => s.id === subMenuItem.menuName);

        const subPermissions = (subMenuItem.permissions || []).map((perm: any) => ({
          permissionId: perm.id,
          permissionName: perm.permissionName,
          status: 'Active',
        }));

        return {
          status: 'Active',
          menuId: subMenuItem.menuName,
          menuName: matchedSub?.menuName || '',
          parentMenuId: menuItem.menuName,
          parentMenuName: matchedMenu?.menuName || '',
          permissionDetails: subPermissions,
        };
      });

      return {
        id: this.roleMenuId || '',
        actionBy: this.userId,
        status: 'Active',
        menuId: menuItem.menuName,
        menuName: matchedMenu?.menuName || '',
        subMenuLists,
        permissionDetails: parentPermissions,
      };
    });
    const appId = formData.appName;
    const appName = this.appsData.find((item: any) => item.id === appId)?.value;

    const roleId = formData.role;
    const roleName = this.roleData.find((item: any) => item.id === roleId)?.roleName;

    const payload = {
      appId: appId,
      appName: appName || '',
      roleId: formData.role,
      roleName: roleName || '',
      status: formData.status,
      actionBy: this.userId,
      menuDetail: menuDetail
    };

    // const payload = {
    //   appId: formData.appName,
    //   roleId: formData.role,
    //   status: formData.status,
    //   actionBy: this.userId,
    //   menuDetails: menuDetail
    // };

    if (this.roleMenuId) {
      // Update logic
      this.roleAppMenuMappingService.updateRoleAppMenu(this.roleMenuId, payload).subscribe({
        next: () => {
          this.toastr.success('Role menu mapping updated successfully');
          this.getRoleAppMenuById();
        },
        error: (error) => {
          this.toastr.error(error?.error?.message || 'Update failed');
        }
      });
    } else {
      // Create logic
      //   this.roleAppMenuMappingService.roleAppMenuCreate(payload).subscribe({
      //     next: () => {
      //       this.toastr.success('Role menu mapping created successfully');
      //     },
      //     error: (error) => {
      //       this.toastr.error(error?.error?.message || 'Creation failed');
      //     }
      //   });
      // }

      console.log('Inside CREATE block');
      // ✅ Create logic
      const menuDetails = formData.menu.map((menuItem: any) => {
        const matchedMenu = this.allMenus.find((m: any) => m.id === menuItem.menuName);
        const subMenuLists = menuItem.subMenu?.map((subMenuItem: any) => {
          const matchedSubMenu = matchedMenu?.subMenu?.find((sm: any) => sm.id === subMenuItem.menuName);
          return {
            menuId: subMenuItem.menuName || '',
            menuName: matchedSubMenu?.menuName || '',
            parentMenuId: menuItem.menuName || '',
            parentMenuName: matchedMenu?.menuName || '',
            permissionDetails: subMenuItem.permissions?.map((permission: any) => ({
              permissionId: permission.id || '',
              permissionName: permission.permissionName || '',
              status: 'Active'
            })) || []
          };
        }) || [];

        return {
          menuId: menuItem.menuName || '',
          menuName: matchedMenu?.menuName || '',
          subMenuLists: subMenuLists,
          permissionDetails: menuItem.permissions?.map((permission: any) => ({
            permissionId: permission.id || '',
            permissionName: permission.permissionName || '',
            status: 'Active'
          })) || []
        };
      });

      const payload = {
        status: 'Active',
        appId,
        appName,
        roleId,
        roleName,
        actionBy: this.userId,
        menuDetails: menuDetails
      };

      this.roleAppMenuMappingService.roleAppMenuCreate(payload).subscribe({
        next: (response: any) => {
          this.toastr.success('App Menu Mapping created successfully');
          this.onCancel();
        },
        error: (error) => {
          this.toastr.error(error?.error?.message || 'Creation failed');
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/masters/app-role-menu-mapping']);
  }

  // removeSubMenu(menuIndex: number, subMenuIndex: number) {
  //   const subMenuArray = this.subMenus(menuIndex);
  //   if (subMenuArray) {
  //     subMenuArray.removeAt(subMenuIndex);
  //   }
  // }


removeSubMenu(menuIndex: number, subMenuIndex: number) {
  const subMenuArray = this.subMenus(menuIndex);

  if (!subMenuArray) return;

  const subMenuGroup = subMenuArray.at(subMenuIndex);

  // Case 1: Newly added submenu (doesn’t have ID or only exists in form)
  if (!subMenuGroup.get('id')?.value) {
    subMenuArray.removeAt(subMenuIndex);
  } else {
    // Case 2: Existing submenu – set status to Inactive so it's excluded from UI but sent in payload
    subMenuGroup.patchValue({ status: 'Inactive' });
    subMenuArray.removeAt(subMenuIndex);
  }
}



getAvailableSubMenus(menuIndex: number): any[] {
  const selectedIds = this.subMenus(menuIndex).controls
    .map(ctrl => ctrl.get('menuName')?.value)
    .filter(Boolean);
  return this.allSubmenus?.filter((sub:any) => !selectedIds.includes(sub.id));
}



  // getRoleAppMenuById() {
  //   this.loadSpinner = true;
  //   this.roleAppMenuMappingService.roleAppMenuDataById(this.roleMenuId).subscribe(
  //     (response: any) => {
  //       if (response) {
  //         this.roleMenuByIdData = response;
  //         console.log("roleMenuByIdData", this.roleMenuByIdData);
  //         this.menuName = this.roleMenuByIdData?.menuDetails[0]?.menuName;
  //         console.log(this.menuName, "MENU NAME last");


  //         this.patchMenuForm(this.roleMenuByIdData);
  //       }
  //       this.loadSpinner = false;
  //     },
  //     (error) => {
  //       this.loadSpinner = false;
  //     }
  //   );
  // }

  getRoleAppMenuById() {
    this.loadSpinner = true;
    this.roleAppMenuMappingService.roleAppMenuDataById(this.roleMenuId).subscribe(
      (response: any) => {
        if (response) {
          this.roleMenuByIdData = response; // ✅ Just store data here
          this.menuName = this.roleMenuByIdData?.menuDetails[0]?.menuName;
          this.getAllMenus(); // ✅ Patch happens *after* menus load
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

    return (permissions || [])
      .map((perm) => {
        const lastWord = perm.permissionName.split('_').pop()?.toUpperCase();
        return allowedPermissions.includes(lastWord || '')
          ? {
            id: perm?.permissionId || perm?.id || '',
            permissionName: lastWord
          }
          : null;
      })
      .filter(Boolean);
  }

  patchMenuForm(menuList: any) {
    this.menuForm.patchValue({
      appName: menuList?.appId,
      status: menuList?.status,
      role: menuList?.roleId
    });

    this.menus().clear();

    menuList?.menuDetails.forEach((menuItem: any, index: number) => {
      const menuId = menuItem.menuId;
      const matchedMenu = this.allMenus.find((m: any) => m.id === menuId);

      const allPermissions = matchedMenu?.permissions?.map((perm: any) => ({
        id: perm.id,
        permissionName: perm.permissionName.split('_').pop()
      })) || [];

      const selectedPermissions = this.mapPermissions(menuItem.permissionDetails);

      this.menuPermissionsMap[index] = allPermissions;

      const menuGroup = this.formBuilder.group({
        menuName: [menuId, Validators.required],
        permissions: [selectedPermissions],
        subMenu: this.formBuilder.array([]),
      });

      if (menuItem.subMenuLists && menuItem.subMenuLists.length) {
        const subMenuArray = menuGroup.get('subMenu') as FormArray;

        menuItem.subMenuLists.forEach((subMenuItem: any, subIndex: number) => {
          const subMenuId = subMenuItem.menuId;
          const parentMenu = this.allMenus.find((m: any) => m.id === menuId);
          const matchedSubMenu = parentMenu?.subMenu?.find((s: any) => s.id === subMenuId);

          const allSubPermissions = matchedSubMenu?.permissions?.map((perm: any) => ({
            id: perm.id,
            permissionName: perm.permissionName.split('_').pop()
          })) || [];

          this.allSubmenus = parentMenu?.subMenu || []; //to show submenus name only insteadof id in dropdown

          const selectedSubPermissions = this.mapPermissions(subMenuItem.permissionDetails);

          this.subMenuPermissionsMap[`${index}-${subIndex}`] = allSubPermissions;

          const subMenuGroup = this.formBuilder.group({
            id: [subMenuId],
            menuName: [subMenuId, Validators.required],
            permissions: [selectedSubPermissions],
          });

          subMenuArray.push(subMenuGroup);
        });
      }

      this.menus().push(menuGroup);
    });
  }


}
