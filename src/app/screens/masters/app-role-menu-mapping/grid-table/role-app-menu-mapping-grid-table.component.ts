import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-role-app-menu-mapping-grid-table',
  templateUrl: './role-app-menu-mapping-grid-table.component.html',
  styleUrl: './role-app-menu-mapping-grid-tablecomponent.scss',
})
export class RoleAppMenuMappingGridTableComponent {
  @Input() roleAppMenuMapping: any;
}
