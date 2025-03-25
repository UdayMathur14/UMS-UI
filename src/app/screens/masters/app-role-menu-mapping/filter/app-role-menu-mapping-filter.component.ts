import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-role-menu-mapping-filter',
  templateUrl: './app-role-menu-mapping-filter.component.html',
  styleUrl: './app-role-menu-mapping-filter.component.scss',
})
export class AppRoleMenuMappingFilterComponent {
  @Input() filters: any;
  appName: any;
  menuName: any;
  status: any;
  roleName: any;
  @Output() getData: EventEmitter<object> = new EventEmitter();

  onSearch() {
    let object = {
      appName: this.appName || '',
      menuName: this.menuName || '',
      status: this.status || '',
      roleName: this.roleName || ''
    };
    this.getData.emit(object);
  }

  onClear() {
    this.appName = undefined;
    this.menuName = undefined;
    this.status = undefined;
    this.roleName = undefined;
    let object = {
      appName: undefined,
      menuName: undefined,
      status: undefined,
      roleName: undefined
    };
    this.getData.emit(object);
  }
}
