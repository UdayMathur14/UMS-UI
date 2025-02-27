import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-app-menu-mapping',
  templateUrl: './add-edit-app-menu-mapping.component.html',
  styleUrl: './add-edit-app-menu-mapping.component.scss',
})
export class AddEditAppMenuMappingComponent {
  menuForm: FormGroup;
  isEditMode = false; // Change this based on edit mode logic
  appNames = ['App1', 'App2', 'App3']; // Example data for App Name dropdown
  permissions = ['Add', 'Edit', 'View']; // Permission options
  statusOptions = ['Active', 'Inactive'];

  // Separate selected permissions for main menu
  selectedMainPermissions = [];

  // Map to store selected permissions for each submenu by index
  submenuPermissionsMap: { [key: number]: any[] } = {};

  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
  };

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.menuForm = this.formBuilder.group({
      appName: ['', Validators.required],
      menuName: ['', Validators.required],
      routing: ['', Validators.required],
      description: [''],
      orderBy: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      level: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      permission: [[]], // Multi-select dropdown for main menu
      status: ['', Validators.required],
      submenus: this.formBuilder.array([]), // FormArray for submenus
    });
  }

  get submenus(): FormArray {
    return this.menuForm.get('submenus') as FormArray;
  }

  addSubmenu() {
    const submenuForm = this.formBuilder.group({
      name: ['', Validators.required],
      routing: ['', Validators.required],
      description: [''],
      orderBy: ['', Validators.required],
      level: ['', Validators.required],
      permission: [[]], // Independent permission array for each submenu
      status: ['', Validators.required],
    });

    this.submenus.push(submenuForm);
    const newIndex = this.submenus.length - 1;
    this.submenuPermissionsMap[newIndex] = [];
    console.log('New Submenu Index:', newIndex);
    return newIndex;
  }

  removeSubmenu(index: number) {
    this.submenus.removeAt(index);

    delete this.submenuPermissionsMap[index];

    // Reindex the permissions map to match the actual indices after removal
    const newPermissionsMap: { [key: number]: any[] } = {};
    Object.keys(this.submenuPermissionsMap).forEach((key) => {
      const keyNum = parseInt(key);
      if (keyNum > index) {
        newPermissionsMap[keyNum - 1] = this.submenuPermissionsMap[keyNum];
      } else if (keyNum < index) {
        newPermissionsMap[keyNum] = this.submenuPermissionsMap[keyNum];
      }
    });

    this.submenuPermissionsMap = newPermissionsMap;
  }


  getSubmenuPermissions(index: number): any[] {
    return this.submenuPermissionsMap[index] || [];
  }


  onSubmenuPermissionChange(index: number, event: any) {
    this.submenus.at(index).get('permission')?.setValue(event);
  }

  onMainPermissionChange(event: any) {
    this.menuForm.get('permission')?.setValue(event);
  }

  submitForm() {
    if (this.menuForm.valid) {
      
      const formData = this.menuForm.value;

      formData.submenus.forEach((submenu: any, index: number) => {
        submenu.permission = this.submenuPermissionsMap[index] || [];
      });

      console.log('Form submitted:', formData);
      alert('Form Submitted Successfully!');
    } else {
      this.markFormGroupTouched(this.menuForm);
      alert('Please fill in all required fields correctly.');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          }
        }
      } else {
        control?.markAsTouched();
      }
    });
  }

  onCancelPress() {
    this.router.navigate(['/masters/app-menu-mapping']);
  }
}
