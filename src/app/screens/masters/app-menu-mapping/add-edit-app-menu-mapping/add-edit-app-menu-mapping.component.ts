import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-app-menu-mapping',
  templateUrl: './add-edit-app-menu-mapping.component.html',
  styleUrl: './add-edit-app-menu-mapping.component.scss',
})
export class AddEditAppMenuMappingComponent implements OnInit {
  menuForm: FormGroup;
  isEditMode = false;
  permissions = ['Add', 'Edit', 'View'];
  statusOptions = ['Active', 'Inactive'];
  userId: string = '';
  offset = 0;
  count: number = Number.MAX_VALUE;
  selectedMainPermissions = [];
  appsData: any;
  loadSpinner: boolean = true;

  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
  };

  constructor(private router: Router, private formBuilder: FormBuilder, private lookupService: LookupService,) {
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
  }

  menus(): FormArray {
    return this.menuForm.get('menu') as FormArray;
  }

  subMenus(): FormArray {
    return this.menuForm.get('menu') as FormArray;
  }

  addMenu() {
    const newMenu = this.formBuilder.group({
      menuName: ['', Validators.required],
      routing: ['', Validators.required],
      description: [''],
      orderBy: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      level: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      permission: [[]],
      menu: this.formBuilder.array([]),
    });
    this.menus().push(newMenu);
  }

  submitForm() {
   
  }

  onCancelPress() {
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
      return false
    }
    return true;
  }
}
