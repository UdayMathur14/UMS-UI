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

  private forgetPasswordData: {
    userEmailId: string | null,
    // otp: string | null,
    password: any | null
  } = {
      userEmailId: '',
      // otp: '',
      password: ''
    };

  setPasswordData(data: { name: string | null, contactNo: string | null, emailId: string | null, organisation: string | null, methodType: string | null, designation: string | null }) {
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

  setForgetPassword(data: {
    userEmailId: string | null,
    password: any | null,
    message: any | null
  }) {
    this.forgetPasswordData = data;
  }

  getPasswordData() {
    return this.passwordData;
  }

  getChangePasswordData() {
    return this.changePasswordData;
  }

  getForgetPassword() {
    return this.forgetPasswordData;
  }


}