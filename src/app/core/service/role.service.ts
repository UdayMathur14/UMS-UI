import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { APIConstant } from '../constants/api.constant';
import { AuthRequest } from '../models/auth';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CRUDService<AuthRequest> {

  maxCount: number = 9000000;

   constructor(
      protected override baseService: BaseService,
    ) {
      super(baseService, APIConstant.basePath);
    }
  
    roleData(userId: any, offset: number = 0, count: number = this.maxCount, data: any) {
      const url = `${APIConstant.role}/${userId}?offset=${offset}&count=${count}`;
      return this.baseService.post(url, data);
    }
    
    roleDataById(id: string | null = '') {
      const url = `${APIConstant.roleById}/${id}`;
      return this.baseService.get(url);
    }

    roleCreate(data: any) {
      return this.baseService.post(APIConstant.createRole, data);
    }

    roleUpdate(id: string | null = '', data: any) {
      const url = `${APIConstant.updateRole}/${id}`;
      return this.baseService.put(url, data);
    }
}
