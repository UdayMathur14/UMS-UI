import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lookup-grid-table',
  templateUrl: './lookup-grid-table.component.html',
  styleUrl: './lookup-grid-table.component.scss',
})
export class LookupGridTableComponent {
  @Input() lookups: any;
}
