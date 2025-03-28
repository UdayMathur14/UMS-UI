import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-app-menu-mapping-grid-table',
  templateUrl: './role-app-menu-mapping-grid-table.component.html',
  styleUrl: './role-app-menu-mapping-grid-tablecomponent.scss',
})
export class RoleAppMenuMappingGridTableComponent {
  @Input() roleAppMenuMapping: any;

    constructor(private router: Router){}
  
    onEdit(id: string = ''){
      this.router.navigate(['/masters/edit-app-role-menu-mapping', id])
    }
}
