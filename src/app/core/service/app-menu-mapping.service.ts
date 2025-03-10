import { Injectable } from '@angular/core';
import { APIConstant } from '../constants/api.constant';
import { AuthRequest } from '../models/auth';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class AppMenuMappingService extends CRUDService<AuthRequest> {
  maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  appMenuMappingData(
    userId: any,
    offset: number = 0,
    count: number = this.maxCount,
    data: any
  ) {
    const url = `${APIConstant.appMenuMapping}/${userId}?offset=${offset}&count=${count}`;
    return this.baseService.post(url, data);
  }

  appMenuCreate(data: any) {
    return this.baseService.post(APIConstant.appMenuCreate, data);
  }

  appMenuDataById(id: string | null = '') {
    const url = `${APIConstant.appMenuGetById}/${id}`;
    return this.baseService.get(url);
  }
}
