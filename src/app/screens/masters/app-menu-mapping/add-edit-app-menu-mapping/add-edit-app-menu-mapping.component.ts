import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-app-menu-mapping',
  templateUrl: './add-edit-app-menu-mapping.component.html',
  styleUrl: './add-edit-app-menu-mapping.component.scss',
})
export class AddEditAppMenuMappingComponent {

  constructor(private router: Router) {
  }

  onCancelPress() {
    this.router.navigate(['/masters/app-menu-mapping']);
  }
}
