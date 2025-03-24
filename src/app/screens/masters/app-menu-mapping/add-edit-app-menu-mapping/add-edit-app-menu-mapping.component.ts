import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '../../../../core/service/lookup.service';
import { AppMenuMappingService } from '../../../../core/service/app-menu-mapping.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-app-menu-mapping',
  templateUrl: './add-edit-app-menu-mapping.component.html',
  styleUrl: './add-edit-app-menu-mapping.component.scss',
})
export class AddEditAppMenuMappingComponent implements OnInit {
  menuForm: FormGroup;
  permissionDropdown = {};
  statusOptions = ['Active', 'Inactive'];
  userId: string = '';
  offset = 0;
  count: number = Number.MAX_VALUE;
  appsData: any;
  loadSpinner: boolean = true;
  permissionData: any[] = [];
  menuById: any;
  menuId: any;
  allpermissions = [
    { id: '', permissionName: 'ADD' },
    { id: '', permissionName: 'EDIT' },
    { id: '', permissionName: 'VIEW' },
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private menuService: AppMenuMappingService,
    private toastr: ToastrService,
    private route: ActivatedRoute
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
    this.menuId = this.route.snapshot.paramMap.get('id');
    this.getApps();
    this.dropdownData();
    this.getPermissions();
    if(this.menuId){
      this.getAppMenuById();
    }
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
      routing: ['', Validators.required],
      description: [''],
      orderBy: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      level: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      permissions: [[]],
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

  getPermissions() {
    this.permissionData = this.allpermissions.map((item: any) => ({
      id: item.id || "",
      permissionName: item.permissionName || "",
    }));
  }

  onSubmit() {
    if (this.menuId) {
      const formValue = this.menuForm.value;
      const appId = this.appsData.find(
        (item: any) => item?.value == formValue.appName
      )?.id;
    
      const mapPermissions = (formPermissions: any[], getByIdPermissions: any[]) => {
        const permissionTypes = ['ADD', 'EDIT', 'VIEW'];
      
        return permissionTypes
          .map((permType) => {
            const formPerm = formPermissions.find((p: any) => p.permissionName === permType);
            const getByIdPerm = getByIdPermissions.find((p: any) =>
              p.permissionName.endsWith(`_${permType}`)
            );
            if (formPerm && getByIdPerm) {
              return { id: getByIdPerm.id, permissionName: permType, status: 'Active' };
            } 
            if (formPerm && !getByIdPerm) {
              return { id: '', permissionName: permType, status: 'Active' };
            } 
            if (!formPerm && getByIdPerm) {
              return { id: getByIdPerm.id, permissionName: permType, status: 'Inactive' };
            }
      
            return null;
          })
          .filter((perm) => perm !== null);
      };
      
      const payload = {
        status: formValue.status,
        appName: formValue.appName,
        appId: appId,
        actionBy: this.userId,
        menuURL: formValue?.menu[0]?.routing || null,
        description: formValue.menu[0]?.description || null,
        orderBy: Number(formValue.menu[0]?.orderBy) || 0,
        level: Number(formValue.menu[0]?.level) || 0,
        permissions: mapPermissions(
          formValue.menu[0]?.permissions || [],
          this.menuById.permissions || []
        ),
        subMenu: formValue.menu[0]?.subMenu.map((submenu: any) => {
          const existingSubmenu = this.menuById[0].subMenu?.find(
            (item: any) => item.id === submenu.id
            
          );
          return {
            id: submenu.id || null,
            menuName: submenu.menuName,
            menuURL: submenu.routing,
            description: submenu.description || '',
            orderBy: Number(submenu.orderBy) || 0,
            level: Number(submenu.level) || 0,
            status: submenu.status,
            permissions: mapPermissions(
              submenu.permissions || [],
              existingSubmenu?.permissions || []
            ),
          };
        }),
      };
    
      this.menuService.updateAppMenu(this.menuId, payload).subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success('App ' + response.message);
          this.onCancel();
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
    }
    
     else {
      const formValue = this.menuForm.value;
      const appId = this.appsData.find(
        (item: any) => item?.value == formValue.appName
      )?.id;
      const payload = {
        status: formValue.status,
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
            permissions: sub.permissions.map((perm: any) => perm.permissionName),
          })),
        })),
      };
  
      this.menuService.appMenuCreate(payload).subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success('App ' + response.message);
          this.onCancel();
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
    }
    
  }

  onCancel() {
    this.router.navigate(['/masters/app-menu-mapping']);
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
          this.menuById = response.menuList
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
          ? { id: perm?.id || "", permissionName: lastWord, status: perm?.status } 
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
        orderBy: [menuItem.orderBy, [Validators.required, Validators.pattern('^[0-9]*$')]],
        level: [menuItem.level, [Validators.required, Validators.pattern('^[0-9]*$')]],
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
            orderBy: [subMenuItem.orderBy, [Validators.required, Validators.pattern('^[0-9]*$')]],
            level: [subMenuItem.level, [Validators.required, Validators.pattern('^[0-9]*$')]],
            permissions: [this.mapPermissions(subMenuItem.permissions)],
          });
  
          subMenuArray.push(subMenuGroup);
        });
      }
  
      this.menus().push(menuGroup);
    });
  }
}
