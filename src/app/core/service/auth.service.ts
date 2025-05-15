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

  private isAuthenticated = false;
  private authSecretKey = 'data';

  constructor(
    protected override baseService: BaseService,
  ) {
    super(baseService, APIConstant.basePath);
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
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

     logInUserStatus(emailId: any) {
      const url = `${APIConstant.loginUserStatus}/${emailId}`;
      return this.baseService.get(url);
    }
}
