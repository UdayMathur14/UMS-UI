import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordDataShareService {

  constructor() { }

  private passwordData: { name: string | null, contactNo: string | null, emailId: string | null, organisation: string | null, methodType: string | null, designation: string | null } = {
    name: '',
    contactNo: '',
    emailId: '',
    organisation: '',
    methodType: '',
    designation: ''
  };

  private changePasswordData: {
    userEmailId: string | null, 
    oldPassword: any | null, 
    newPassword: any | null,
    actionBy: string | null
  } = {
    userEmailId: '',
    oldPassword: '',
    newPassword: '',
    actionBy: ''
  }

  setPasswordData(data: { name: string | null, contactNo: string| null, emailId: string | null, organisation: string | null, methodType: string | null, designation: string | null }) {
    this.passwordData = data;
  }

  setChangePasswordData(data: { 
    userEmailId: string | null, 
    oldPassword: any | null, 
    newPassword: any | null,
    actionBy: string | null  
  }) {
    this.changePasswordData = data;
  }

  getPasswordData() {
    return this.passwordData;
  }

  getChangePasswordData() {
    return this.changePasswordData;
  }
}