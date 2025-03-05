import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  apps: any;
  accessToken: string = '';

  ngOnInit(): void {
    const storedData: any = localStorage.getItem('data');
    const dataObj = JSON.parse(storedData);
    this.apps = dataObj.apps;
    this.accessToken = dataObj?.accessToken
  }

  onClickApp(data: any){
    console.log(data);
    
    if(data.name.toLowerCase().replace(/\s/g, '') == 'usermanagamentsystem'){
      window.location.href = data.route;
    } else {
      window.location.href = `${data.route}?data=${this.accessToken}&appId=${data.id}`;
    }
    
  }


}
