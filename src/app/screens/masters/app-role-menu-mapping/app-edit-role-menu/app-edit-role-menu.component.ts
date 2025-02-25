import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-edit-role-menu',
  templateUrl: './app-edit-role-menu.component.html',
  styleUrl: './app-edit-role-menu.component.scss',
})
export class AppEditRoleMenuComponent {
  menuForm: FormGroup;
  isEditMode = false; // Change this based on edit mode logic
  appNames = ['App1', 'App2', 'App3']; // Example data for App Name dropdown
  permissions = ['Add', 'Edit', 'View'];
  statusOptions = ['Active', 'Inactive'];
  selectedPermissions = []; // Default selected values

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
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
      permission: [[]], // Multi-select dropdown
      status: ['', Validators.required],
      submenus: this.formBuilder.array([]), // FormArray for submenus
    });
  }

  // Explicitly type 'submenus' as FormArray<FormGroup>
  get submenus(): FormArray<FormGroup> {
    return this.menuForm.get('submenus') as FormArray<FormGroup>;
  }

  // Add a new submenu form group
  addSubmenu() {
    const submenuForm = this.formBuilder.group({
      name: ['', Validators.required],
      routing: ['', Validators.required],
      description: [''],
      permission: [[]],
      status: ['', Validators.required],
    });

    this.submenus.push(submenuForm);
  }

  // Remove a submenu form group
  removeSubmenu(index: number) {
    this.submenus.removeAt(index);
  }

  submitForm() {
    if (this.menuForm.valid) {
      console.log(this.menuForm.value);
      alert('Form Submitted Successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  onCancelPress() {
    this.router.navigate(['/masters/app-role-menu-mapping']);
  }
}
