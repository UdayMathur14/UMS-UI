import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrl: './grid-table.component.scss',
})
export class GridTableComponent {
  @Input() appMenuMapping: any
}
