import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  @Input() filters: any;

  appName: any;
  menuName: any;
  status: any;
  @Output() getData: EventEmitter<object> =new EventEmitter();
  

  onSearch() {
    let object = {
      appName: this.appName || '',
      menuName: this.menuName ||'',
      status:this.status ||''
    };
    this.getData.emit(object)
  }

  onClear() {
    this.appName=undefined;
    this.menuName=undefined;
    this.status=undefined;
    let object = {
      appName:undefined,
      menuName:undefined,
      status:undefined
    }
    this.getData.emit(object)
  }
}