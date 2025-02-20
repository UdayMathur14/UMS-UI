import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-master-filter',
  templateUrl: './user-master-filter.component.html',
  styleUrl: './user-master-filter.component.scss',
})
export class UserMasterFilterComponent {
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

  onClearFilter(){
    this.name = undefined;
    this.organisation = undefined;
    this.status = undefined;
    let obj = {
      "pointName" : undefined,
      "locationIds" : undefined,
      "status": undefined
    }
    this.getData.emit(obj)
  }
}
