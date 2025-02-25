import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordDataShareService {

  constructor() { }

  private passwordData: { name: string | null, contactNo: string | null, emailId: string | null, organisation: string | null } = {
    name: '',
    contactNo: '',
    emailId: '',
    organisation: ''
  };

  setPasswordData(data: { name: string | null, contactNo: string| null, emailId: string | null, organisation: string | null }) {
    this.passwordData = data;
  }

  getPasswordData() {
    return this.passwordData;
  }
}
