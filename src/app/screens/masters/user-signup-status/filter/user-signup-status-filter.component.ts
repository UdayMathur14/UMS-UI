import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-signup-status-filter',
  templateUrl: './user-signup-status-filter.component.html',
  styleUrl: './user-signup-status-filter.component.scss',
})
export class UserSignupStatusFilterComponent {
  @Input() filters: any;
  name: any;
  organisation: any;
  status: any;
  @Output() getData: EventEmitter<object> = new EventEmitter();
  onSearch() {
    let obj = {
      name: this.name || '',
      organisation: this.organisation || '',
      status: this.status || '',
    };
    this.getData.emit(obj);
  }

  onClearFilter() {
    this.name = undefined;
    this.organisation = undefined;
    this.status = undefined;
    let obj = {
      name: undefined,
      organisation: undefined,
      status: undefined,
    };
    this.getData.emit(obj);
  }
}
