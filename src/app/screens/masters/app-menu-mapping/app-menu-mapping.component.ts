import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-menu-mapping',
  templateUrl: './app-menu-mapping.component.html',
  styleUrl: './app-menu-mapping.component.scss'
})
export class AppMenuMappingComponent {

  constructor(private router: Router){
    
  }

  onCreate(){
    this.router.navigate(['/masters/add-app-menu-mapping'])
  }

}
