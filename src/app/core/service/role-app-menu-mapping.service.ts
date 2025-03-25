import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth';
import { APIConstant } from '../constants/api.constant';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAppMenuMappingService extends CRUDService<AuthRequest> {
maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  roleAppMenuMappingData(
    offset: number = 0,
    count: number = this.maxCount,
    data: any
  ) {
    const url = `${APIConstant.roleAppMenuMapping}?offset=${offset}&count=${count}`;
    return this.baseService.post(url, data);
  }

  roleAppMenuCreate(data: any) {
    return this.baseService.post(APIConstant.roleAppMenuCreate, data);
  }

  roleAppMenuDataById(id: string | null = '') {
    const url = `${APIConstant.roleAppMenuGetById}/${id}`;
    return this.baseService.get(url);
  }

  updateRoleAppMenu(id: string | null = '', data: any) {
    const url = `${APIConstant.updateroleAppMenu}/${id}`;
    return this.baseService.put(url, data);
  }
}
