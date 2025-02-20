import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-role-master-filter',
  templateUrl: './role-master-filter.component.html',
  styleUrl: './role-master-filter.component.scss',
})
export class RoleMasterFilterComponent {
  @Input() filters: any;
  roleName: any;
  status: any;
  @Output() getData: EventEmitter<object> = new EventEmitter();

  onSearch() {
    let obj = {
      roleName: this.roleName || '',
      status: this.status || '',
    };
    this.getData.emit(obj);
  }

  onClearFilter() {
    this.roleName = undefined;
    this.status = undefined;
    let obj = {
      roleName: undefined,
      status: undefined,
    };

    this.getData.emit(obj);
  }
}
