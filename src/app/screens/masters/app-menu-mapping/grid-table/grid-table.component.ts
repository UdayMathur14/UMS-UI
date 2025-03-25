import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrl: './grid-table.component.scss',
})
export class GridTableComponent {
  @Input() appMenuMapping: any;

  constructor(private router: Router){}

  onEdit(id: string = ''){
    this.router.navigate(['masters/edit-app-menu-mapping', id])
  }
}
