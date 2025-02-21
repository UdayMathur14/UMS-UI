import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-menu-mapping',
  templateUrl: './app-menu-mapping.component.html',
  styleUrl: './app-menu-mapping.component.scss'
})
export class AppMenuMappingComponent {

  menuForm: FormGroup;

  constructor(private router: Router,  private formBuilder: FormBuilder,){
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

  onCreate(){
    this.router.navigate(['/masters/add-app-menu-mapping'])
  }

}
