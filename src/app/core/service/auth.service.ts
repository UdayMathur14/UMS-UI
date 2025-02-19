import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { AuthRequest } from '../models/auth';
import { BaseService } from './base.service';
import { APIConstant } from '../constants/api.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends CRUDService<AuthRequest> {
  constructor(
    protected override baseService: BaseService,
    private http: HttpClient
  ) {
    super(baseService, APIConstant.basePath);
  }

  signUp(data: any) {
    return this.baseService.post(APIConstant.signUp, data);
  }

  login(data: any) {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(data.username + ':' + data.password));

    return this.baseService.post(
        APIConstant.login,
        null,
        { headers: headers });
}
}
