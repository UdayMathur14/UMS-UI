import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { APIConstant } from '../constants/api.constant';
import { AuthRequest } from '../models/auth';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class UserSignupStatusService extends CRUDService<AuthRequest> {

  maxCount: number = Number.MAX_VALUE;

   constructor(
      protected override baseService: BaseService,
    ) {
      super(baseService, APIConstant.basePath);
    }
  
    signupUserStatus(userId: any, offset: number = 0, count: number = this.maxCount, data: any) {
      const url = `${APIConstant.signupStatus}/${userId}?offset=${offset}&count=${count}`;
      return this.baseService.post(url, data);
    }
    
    signupUserStatusDataById(id: string = '') {
      const url = `${APIConstant.signupStatusDataById}/${id}`;
      return this.baseService.get(url);
    }

    signupUserStatusUpdate(id: string = '', data: any) {
      const url = `${APIConstant.signupStatusUpdate}/${id}`;
      return this.baseService.put(url, data);
    }
}
