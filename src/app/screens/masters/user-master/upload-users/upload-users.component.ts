import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserMasterService } from '../../../../core/service/user-master.service';

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrl: './upload-users.component.scss',
})
export class UploadUsersComponent implements OnInit {
  @ViewChild('excelInput') excelInput!: ElementRef;
  organisation: string = '';
  actionBy: string = '';
  loadSpinner: boolean = false;
  uploadedFileName: string = '';
  uploadedFile: File | null = null;

  constructor(
    private toastr: ToastrService,
    private userServcie: UserMasterService
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('data');
    if (data) {
      const userData = JSON.parse(data);
      this.organisation = userData?.organisation;
      this.actionBy = userData?.userId;
    }
  }

  uploadExcel() {
    this.excelInput.nativeElement.click();
  }

  handleExcelUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const isExcel = file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
    if (!isExcel) {
      this.toastr.error('Please upload a valid Excel file (.xls or .xlsx)');
      return;
    }

    this.uploadedFileName = file.name;
    this.uploadedFile = file;
  }

  viewFile() {
    if (this.uploadedFile) {
      const fileURL = URL.createObjectURL(this.uploadedFile);
      window.open(fileURL, '_blank');
    }
  }

  clearFile() {
    this.uploadedFile = null;
    this.uploadedFileName = '';
    if (this.excelInput && this.excelInput.nativeElement) {
      this.excelInput.nativeElement.value = '';
    }
  }

  onUpload() {
    if (!this.uploadedFile) {
      this.toastr.warning('Please select a file before uploading.');
      return;
    }

    this.loadSpinner = true;

    const formData = new FormData();
    formData.append('file', this.uploadedFile);

    this.userServcie
      .uploadUsers(formData, this.organisation, this.actionBy)
      .subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success(response.message);
          this.clearFile();
        },
        // (error) => {
        //   this.loadSpinner = false;
        //   this.toastr.error(error?.error?.message, 'Error');
        // }
      );
  }
}
