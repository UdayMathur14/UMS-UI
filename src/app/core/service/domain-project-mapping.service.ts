import { Injectable } from '@angular/core';
import { APIConstant } from '../constants/api.constant';
import { AuthRequest } from '../models/auth';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class DomainProjectMappingService extends CRUDService<AuthRequest> {

  maxCount: number = Number.MAX_VALUE;

   constructor(
      protected override baseService: BaseService,
    ) {
      super(baseService, APIConstant.basePath);
    }
  
    projectDomainData(userId: any, offset: number = 0, count: number = this.maxCount, data: any) {
      const url = `${APIConstant.domainProject}/${userId}?offset=${offset}&count=${count}`;
      return this.baseService.post(url, data);
    }
    
    domainProjectById(id: string | null = '') {
      const url = `${APIConstant.domainProjectById}/${id}`;
      return this.baseService.get(url);
    }

    domainProjectCreate(data: any) {
      return this.baseService.post(APIConstant.domainProjectCreate, data);
    }

    domainProjectUpdate(id: string | null = '', data: any) {
      const url = `${APIConstant.updateDomainProject}/${id}`;
      return this.baseService.post(url, data);
    }
}
