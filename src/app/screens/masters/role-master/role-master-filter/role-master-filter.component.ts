import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-role-master-filter',
  templateUrl: './role-master-filter.component.html',
  styleUrl: './role-master-filter.component.scss',
})
export class RoleMasterFilterComponent {
  @Input() filters: any;
  name: any;
  organization: any;
  status: any;
  @Output() getData: EventEmitter<object> = new EventEmitter();

  onSearch() {
    let obj = {
      name: this.name || '',
      organization: this.organization || '',
      status: this.status || '',
    };
    this.getData.emit(obj);
  }

  onClearFilter() {
    this.name = undefined;
    this.organization = undefined;
    this.status = undefined;
    let obj = {
      pointName: undefined,
      locationIds: undefined,
      status: undefined,
    };

    this.getData.emit(obj);
  }
}
