import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../../../core/service/lookup.service';
import { RoleService } from '../../../../core/service/role.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppMenuMappingService } from '../../../../core/service/app-menu-mapping.service';

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
  menuById: any;
  menuId: any;
  allMenus: any;
  allSubmenus: any;
  appName: string = '';
  menuName: any;
  selectedMenuId: string = '';
  selectedMenu:any;
  menuPermissionsMap: { [key: number]: any[] } = {};
  subMenuPermissionsMap: { [key: string]: any[] } = {};

  constructor(
    private lookupService: LookupService,
    private roleService: RoleService,
    private router: Router,
    private formBuilder: FormBuilder,
    private menuService: AppMenuMappingService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private appMenuMappingService: AppMenuMappingService
  ) {
    this.menuForm = this.formBuilder.group({
      status: ['', Validators.required],
      appName: ['', Validators.required],
      menu: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    this.getApps();
    this.getRolesList();
    this.dropdownData();
    this.getAllMenus();
    if (this.menuId) {
      this.getAppMenuById();
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
        id: [''],
        menuName: ['', Validators.required],
        routing: ['', Validators.required],
        description: [''],
        orderBy: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        level: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        status: [''],
        permissions: [[]],
      });

      subMenuArray.push(newSubMenu);
    }
  }

  dropdownData() {
    this.permissionDropdown = {
      singleSelection: false,
      idField: 'permissionName',
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
    // Find the selected menu
    const selectedMenu = this.allMenus?.find((menu: any) => menu.id === menuId);
  
    // Extract permissions only for the selected menu row
    this.menuPermissionsMap[menuIndex] = selectedMenu?.permissions?.map((perm: any) => ({
      id: perm.id,
      permissionName: perm.permissionName.split('_').pop(),
    })) || [];
  
    console.log(`Available permissions for row ${menuIndex}:`, this.menuPermissionsMap[menuIndex]);
  }

  getSubMenuPermissions(selectedSubMenuId: string, menuIndex: number, subMenuIndex: number) {
    const subMenuArray = this.subMenus(menuIndex);
    if (!subMenuArray) return;
    const selectedSubMenu = this.allSubmenus?.find((sub: any) => sub.id === selectedSubMenuId);
    this.subMenuPermissionsMap[`${menuIndex}-${subMenuIndex}`] = selectedSubMenu?.permissions?.map((perm: any) => ({
      id: perm.id,
      permissionName: perm.permissionName.split('_').pop(),
    })) || [];
  }
  
  onRoleChange(data: any) {
    if (data && !this.menuId && this.menus().length === 0) {
      this.addMenu();
    }
  }

  onSubmit() {
    // if (this.menuId) {
    //   this.loadSpinner = true;
    //   const formValue = this.menuForm.value;
    //   const appId = this.appsData.find(
    //     (item: any) => item?.value == formValue.appName
    //   )?.id;

    //   const mapPermissions = (
    //     formPermissions: any[],
    //     getByIdPermissions: any[]
    //   ) => {
    //     const permissionTypes = ['ADD', 'EDIT', 'VIEW'];

    //     return permissionTypes
    //       .map((permType) => {
    //         const formPerm = formPermissions.find(
    //           (p: any) => p.permissionName === permType
    //         );
    //         const getByIdPerm = getByIdPermissions.find((p: any) =>
    //           p.permissionName.endsWith(`_${permType}`)
    //         );
    //         if (formPerm && getByIdPerm) {
    //           return {
    //             id: getByIdPerm.id,
    //             permission: permType,
    //             status: 'Active',
    //           };
    //         }
    //         if (formPerm && !getByIdPerm) {
    //           return { id: '', permission: permType, status: 'Active' };
    //         }
    //         if (!formPerm && getByIdPerm) {
    //           return {
    //             id: getByIdPerm.id,
    //             permission: permType,
    //             status: 'Inactive',
    //           };
    //         }

    //         return null;
    //       })
    //       .filter((perm) => perm !== null);
    //   };

    //   const payload = {
    //     status: formValue.status,
    //     appName: formValue.appName,
    //     appId: appId,
    //     actionBy: this.userId,
    //     menuURL: formValue?.menu[0]?.routing || null,
    //     description: formValue.menu[0]?.description || null,
    //     orderBy: Number(formValue.menu[0]?.orderBy) || 0,
    //     level: Number(formValue.menu[0]?.level) || 0,
    //     permissions: mapPermissions(
    //       formValue.menu[0]?.permissions || [],
    //       this.menuById[0].permissions || []
    //     ),
    //     subMenu: formValue.menu[0]?.subMenu.map((submenu: any) => {
    //       const existingSubmenu = this.menuById[0].subMenu?.find(
    //         (item: any) => item.id === submenu.id
    //       );
    //       return {
    //         id: submenu.id || null,
    //         menuName: submenu.menuName,
    //         menuURL: submenu.routing,
    //         description: submenu.description || '',
    //         orderBy: Number(submenu.orderBy) || 0,
    //         level: Number(submenu.level) || 0,
    //         status: submenu.status,
    //         permissions: mapPermissions(
    //           submenu.permissions || [],
    //           existingSubmenu?.permissions || []
    //         ),
    //       };
    //     }),
    //   };

    //   this.menuService.updateAppMenu(this.menuId, payload).subscribe(
    //     (response: any) => {
    //       this.loadSpinner = false;
    //       this.toastr.success('App Menu Mapping ' + response.message);
    //       this.onCancel();
    //     },
    //     (error) => {
    //       this.toastr.error(error?.error?.message, 'Error');
    //       this.loadSpinner = false;
    //     }
    //   );
    // } 
      const formValue = this.menuForm.value;
      const appId = this.appsData.find(
        (item: any) => item?.value == formValue.appName
      )?.id;
      const payload = {
        status: 'Active',
        appName: formValue.appName,
        appId: appId,
        actionBy: this.userId,
        appMenuLists: formValue.menu.map((menu: any) => ({
          menuName: menu.menuName,
          menuURL: menu.routing,
          description: menu.description,
          orderBy: Number(menu.orderBy),
          level: Number(menu.level),
          permissions: menu.permissions.map((perm: any) => perm.permissionName),
          subMenu: menu.subMenu.map((sub: any) => ({
            menuName: sub.menuName,
            menuURL: sub.routing,
            description: sub.description,
            orderBy: Number(sub.orderBy),
            level: Number(sub.level),
            permissions: sub.permissions.map(
              (perm: any) => perm.permissionName
            ),
            status: 'Active',
          })),
        })),
      };

      this.menuService.appMenuCreate(payload).subscribe(
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

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getAppMenuById() {
    this.loadSpinner = true;
    this.menuService.appMenuDataById(this.menuId).subscribe(
      (response: any) => {
        if (response && response.menuList) {
          this.menuById = response.menuList;
          this.patchMenuForm(response.menuList);
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

  patchMenuForm(menuList: any[]) {
    if (!menuList.length) return;
    this.menuForm.patchValue({
      appName: menuList[0].appName,
      status: menuList[0].status,
    });

    this.menus().clear();

    menuList.forEach((menuItem, index) => {
      const menuGroup = this.formBuilder.group({
        menuName: [menuItem.menuName, Validators.required],
        routing: [menuItem.menuURL, Validators.required],
        description: [menuItem.description || ''],
        orderBy: [
          menuItem.orderBy,
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
        level: [
          menuItem.level,
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
        permissions: [this.mapPermissions(menuItem.permissions)],
        subMenu: this.formBuilder.array([]),
      });

      if (menuItem.subMenu && menuItem.subMenu.length) {
        const subMenuArray = menuGroup.get('subMenu') as FormArray;

        menuItem.subMenu.forEach((subMenuItem: any, subIndex: any) => {
          const subMenuGroup = this.formBuilder.group({
            id: [subMenuItem.id],
            menuName: [subMenuItem.menuName, Validators.required],
            routing: [subMenuItem.menuURL, Validators.required],
            description: [subMenuItem.description || ''],
            status: [subMenuItem.status],
            orderBy: [
              subMenuItem.orderBy,
              [Validators.required, Validators.pattern('^[0-9]*$')],
            ],
            level: [
              subMenuItem.level,
              [Validators.required, Validators.pattern('^[0-9]*$')],
            ],
            permissions: [this.mapPermissions(subMenuItem.permissions)],
          });

          subMenuArray.push(subMenuGroup);
        });
      }

      this.menus().push(menuGroup);
    });
  }

  getAllMenus(){
    this.loadSpinner = true;
    const data = {
      status: 'Active',
      menuName:  '',
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
  

  onAppChange(id: string){
   this.appName =  this.appsData.find((item: any) => item.id == id)?.value;
   this.getSelectedMenu();
  }

  onMenuChange(menuId: string, menuIndex: number) {
    this.selectedMenuId = menuId;
    this.menuName = this.allMenus.find((item: any) => item.id == menuId)?.menuName;
    this.getSelectedMenu(menuIndex);
  }
  
}
