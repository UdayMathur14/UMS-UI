import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-app-menu-mapping',
  templateUrl: './add-edit-app-menu-mapping.component.html',
  styleUrl: './add-edit-app-menu-mapping.component.scss',
})
export class AddEditAppMenuMappingComponent {
  loadSpinner: boolean = false;
  menuForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.menuForm = this.formBuilder.group({
      applicationId: ['', Validators.required],
      menuName: ['', Validators.required],
      menuRouting: '',
      menuKey: ['', Validators.required],
      description: ['', Validators.required],
      permissions: [],
      level: 0,
      status: 'Active',
      order: ['', [Validators.required]],
      subMenu: this.formBuilder.array([]),
    });
  }

  subMenus(): FormArray {
    return this.menuForm.get('subMenu') as FormArray;
  }

  subSubMenus(idx: number): FormArray {
    return this.subMenus().at(idx).get('subMenu') as FormArray;
  }

  addSubMenu() {
    const mainMenuRouting = (
      this.menuForm.controls['menuRouting']?.value || ''
    ).replace(/\/?$/, '/');
    const mainMenuKey = this.menuForm.controls['menuKey']?.value || '';
    const newSubMenu = this.formBuilder.group({
      level: 1,
      menuName: '',
      menuRouting: mainMenuRouting,
      menuKey: mainMenuKey,
      description: '',
      status: 'Active',
      permissions: [],
      order: '',
      subMenu: this.formBuilder.array([]),
    });

    newSubMenu.get('menuName')?.valueChanges.subscribe((value) => {
      const spaceValue = value?.replace(/\s+/g, '_');
      const updatedMenuKey = mainMenuKey + '_' + spaceValue;
      newSubMenu.get('menuKey')?.setValue(updatedMenuKey, { emitEvent: false });
    });

    this.subMenus().push(newSubMenu);
  }

  addSubSubMenu(numberOfSubSubMenus: any, subMenuIndex: number) {
    const subMenuArray = this.subMenus()
      .at(subMenuIndex)
      .get('subMenu') as FormArray;
    const subMenuRouting = (
      this.subMenus().at(subMenuIndex).get('menuRouting')?.value || ''
    ).replace(/\/?$/, '/');
    const subMenuMenuKey =
      this.subMenus().at(subMenuIndex).get('menuKey')?.value || '';
    for (let i = 0; i < numberOfSubSubMenus; i++) {
      const newSubSubMenu = this.formBuilder.group({
        level: 2,
        menuName: '',
        menuRouting: subMenuRouting,
        menuKey: subMenuMenuKey,
        description: '',
        status: 'Active',
        permissions: [],
        order:'',
      });

      newSubSubMenu.get('menuName')?.valueChanges.subscribe((value) => {
        const spaceValue = value?.replace(/\s+/g, '_');
        const updatedMenuKey = subMenuMenuKey + '_' + spaceValue;
        newSubSubMenu
          .get('menuKey')
          ?.setValue(updatedMenuKey, { emitEvent: false });
      });

      subMenuArray.push(newSubSubMenu);
    }
  }


  onCancelPress() {
    this.router.navigate(['/masters/app-menu-mapping']);
  }
}
