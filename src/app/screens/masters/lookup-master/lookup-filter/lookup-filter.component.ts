import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lookup-filter',
  templateUrl: './lookup-filter.component.html',
  styleUrl: './lookup-filter.component.scss',
})
export class LookupFilterComponent {
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
