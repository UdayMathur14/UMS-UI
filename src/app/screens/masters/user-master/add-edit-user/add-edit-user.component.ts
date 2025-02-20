import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserMasterService } from '../../../../core/service/user-master.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
})
export class AddEditUserComponent {
  userId: string = '';
  name: any[] = [];
  emailId: any[] = [];
  contactNo: any[] = [];
  designation: any[] = [];
  userCategory: any[] = [];
  oraganisation: any[] = [];

  isEditMode: boolean = false;

  createUserform!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userMasterService: UserMasterService
  ) {}

  ngOnInit(): void {
   this.loadUserMasterDataById();

    this.createUserform = this.formBuilder.group({
      name: [{ value: '', disabled: this.isEditMode }],
      emailId: [{ value: '', disabled: this.isEditMode }],
      contactNo: [{ value: '', disabled: this.isEditMode }],
      designation: [''],
      userCategory: [''],
      organisation: [''],
    });

    // Check if the mode is edit
    this.route.queryParams.subscribe(params => {
      if (params['edit'] === 'true') {
        this.isEditMode = true;
        this.createUserform.get('name')?.disable();
        this.createUserform.get('emailId')?.disable();
        this.createUserform.get('contactNo')?.disable();
      }
    });
  }

  loadUserMasterDataById() {
    this.userMasterService.getUserMasterById(this.userId).subscribe({
      next:({userMaster}: any) => {
        this.createUserform.patchValue({
          name: userMaster.name,
          emailId: userMaster.emailId,
          contactNo: userMaster.contactNo,
          designation: userMaster.designation,
          userCategory: userMaster.userCategory,
          organisation: userMaster.organisation
        }
        )
      }
    })
  }

  handleSave() {
    console.log(this.createUserform.value);
  }
  cancel() {
    this.router.navigate(['/masters/user-master']);
  }
}
