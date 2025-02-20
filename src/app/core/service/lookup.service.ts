import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { AuthRequest } from '../models/auth';
import { BaseService } from './base.service';
import { APIConstant } from '../constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class LookupService extends CRUDService<AuthRequest> {

  maxCount: number = Number.MAX_VALUE;

   constructor(
      protected override baseService: BaseService,
    ) {
      super(baseService, APIConstant.basePath);
    }
  
    lookupData(userId: any, offset: number = 0, count: number = this.maxCount, data: any) {
      const url = `${APIConstant.lookup}/${userId}?offset=${offset}&count=${count}`;
      return this.baseService.post(url, data);
    }
    
    lookupDataById(id: string = '') {
      const url = `${APIConstant.lookupById}/${id}`;
      return this.baseService.get(url);
    }

    lookupCreate(data: any) {
      return this.baseService.post(APIConstant.lookupCreate, data);
    }

    lookupUpdate(id: string = '', data: any) {
      const url = `${APIConstant.lookupUpdate}/${id}`;
      return this.baseService.put(url, data);
    }

    lookupType(data: any) {
      return this.baseService.post(APIConstant.lookupType, data);
    }
  }