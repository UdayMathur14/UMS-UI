import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserMasterService } from '../../../../core/service/user-master.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
})
export class AddEditUserComponent {
  userId: string = '';
  isEditMode: boolean = false;
  loadSpinner: boolean=false
  actionById: string = ''
  createUserform!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userMasterService: UserMasterService
  ) {}

  ngOnInit(): void {
    this.createUserform = this.formBuilder.group({
      name: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      userCategory: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      status: ['Active'],
      userType: ['']
    });
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.actionById = dataObj.userId;
    }
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.isEditMode = true;
        this.createUserform.get('name')?.disable();
        this.createUserform.get('emailId')?.disable();
        this.createUserform.get('contactNo')?.disable();
        this.loadUserMasterDataById();
      }
    });
  }

  loadUserMasterDataById() {
    if (!this.userId) {
      console.log('No userId available');
      return;
    }

    this.loadSpinner = true; // Start the loader
    console.log('Fetching user data for ID:', this.userId);
    this.userMasterService.getUserMasterById(this.userId).subscribe({
      next: (response: any) => {
        console.log('Received user data:', response);
        if (response) {
          this.createUserform.patchValue({
            name: response.name,
            emailId: response.emailId,
            contactNo: response.contactNo,
            designation: response.designation,
            userCategory: response.userCategory,
            organisation: response.organisation,
            status: response.status
          });
          console.log('Form after patch:', this.createUserform.value);
        }
        this.loadSpinner = false; 

      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  handleSave() {
    if (!this.createUserform.valid) {
      return;
    }
    this.loadSpinner = true; // Start the loader
    const formData = this.createUserform.getRawValue();
  
    if (this.isEditMode) {
      const updateData = {
        designation: formData.designation,
        userCategory: formData.userCategory,
        status: this.createUserform.controls['status']?.value,
        userType: formData.emailId.includes('diverseinfotech') ? 'Internal' : 'External',
        actionBy: this.actionById
      };
  
      this.userMasterService.userMasterUpdate(this.userId, updateData).subscribe({
        next: (response) => {
          this.loadSpinner = false; // Start the loader
          this.router.navigate(['/masters/user-master']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.loadSpinner = false; // Stop the loader even if an error occurs

        }
      });
    } else {
      const createData = {
        status: 'Active',
        name: formData.name,
        emailId: formData.emailId,
        contactNo: formData.contactNo,
        designation: formData.designation,
        userCategory: formData.userCategory,
        organisation: formData.organisation,
        userType: formData.emailId.includes('diverseinfotech') ? 'Internal' : 'External',
        createdBy: this.actionById,
      };
  
      console.log('Creating user with data:', createData);
  
      this.userMasterService.userMasterCreate(createData).subscribe({
        next: (response) => {
          this.loadSpinner = false; // Stop the loader even if an error occurs

          this.router.navigate(['/masters/user-master']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.loadSpinner = false; // Stop the loader even if an error occurs

        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/masters/user-master']);
  }
}
