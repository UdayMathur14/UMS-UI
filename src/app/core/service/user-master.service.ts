import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { APIConstant } from '../constants/api.constant';
import { AuthRequest } from '../models/auth';
import { CRUDService } from './crud.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserMasterService extends CRUDService<AuthRequest> {
  maxCount: number = 9000000;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  userMasterData(
    userId: any,
    offset: number = 0,
    count: number = this.maxCount,
    data: any
  ) {
    const url = `${APIConstant.userMaster}/${userId}?offset=${offset}&count=${count}`;
    return this.baseService.post(url, data);
  }

  getUserMasterById(id: string = '') {
    const url = `${APIConstant.getUserMasterById}/${id}`;
    return this.baseService.get(url);
  }

  userMasterUpdate(id: string = '', data: any) {
    const url = `${APIConstant.userMasterUpdate}/${id}`;
    return this.baseService.put(url, data);
  }

  userMasterCreate(data: any) {
    const url = `${APIConstant.createUserMaster}`;

    return this.baseService.post(url, data).pipe(
      catchError((error) => {
        console.error('Service Error:', error);
        return throwError(() => error);
      })
    );
  }
}
