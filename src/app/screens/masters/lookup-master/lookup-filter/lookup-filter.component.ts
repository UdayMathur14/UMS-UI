import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lookup-filter',
  templateUrl: './lookup-filter.component.html',
  styleUrl: './lookup-filter.component.scss',
})
export class LookupFilterComponent {
  @Input() filters: any;
  type: any;
  status: any;
  value: any;
  @Output() getData: EventEmitter<object> = new EventEmitter();

  onSearch() {
    let obj = {
      name: this.type || '',
      status: this.status || '',
    };
    this.getData.emit(obj);
  }

  onClearFilter() {
    this.type = undefined;
    this.status = undefined;
    this.value = undefined;
    let obj = {
      type: undefined,
      status: undefined,
      value: undefined
    };

    this.getData.emit(obj);
  }
}
