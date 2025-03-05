import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  apps: any;

  ngOnInit(): void {
    const storedData: any = localStorage.getItem('data');
    const dataObj = JSON.parse(storedData);
    this.apps = dataObj.apps;
    
  }


}
