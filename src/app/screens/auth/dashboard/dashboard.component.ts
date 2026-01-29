import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  apps: any;
  accessToken: string = '';
  loadSpinner: boolean = false;

  ngOnInit(): void {
    const storedData: any = localStorage.getItem('data');
    const dataObj = JSON.parse(storedData);
    this.apps = dataObj.apps;
    this.accessToken = dataObj?.accessToken
  }

  onClickApp(data: any){
    this.loadSpinner = true;    
    if(data.name.toLowerCase().replace(/\s/g, '') == 'UMS'){
      window.location.href = data.route;
      this.loadSpinner = false;
    } else {
      window.location.href = `${data.route}?data=${this.accessToken}&appId=${data.id}`;
      this.loadSpinner = false;
    }
    
  }


}
