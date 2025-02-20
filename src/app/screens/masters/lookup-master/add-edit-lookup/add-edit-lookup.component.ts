import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-lookup',
  templateUrl: './add-edit-lookup.component.html',
  styleUrl: './add-edit-lookup.component.scss',
})
export class AddEditLookupComponent implements OnInit {
  lookupId: any;
  loadSpinner: boolean = true;
  lookupType: any = [];
  lookupForm = new FormGroup({
    type: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    url: new FormControl(''),
    status: new FormControl(''),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.lookupId = this.activatedRoute.snapshot.paramMap.get('id');
    // this.getLookupById();
    this.lookUpTypeData();
    if(this.lookupId){
      this.getLookupById()
    }
  }

  lookUpTypeData(){
    const data = {
      "status": "",
      "type": ""
    }
    this.lookupService.lookupType(data).subscribe(
      (response: any) => {
        this.lookupType = response?.lookUpTypes
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getLookupById() {
    this.lookupService.lookupDataById(this.lookupId).subscribe(
      (response: any) => {
        this.lookupForm.patchValue({
          type: response?.typeId,
          value: response?.value,
          description: response?.description,
          status: response?.status,
          url: response?.url
        });
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/masters/lookup-master']);
  }

  onSave(){
    const typeId = this.lookupForm.controls['type']?.value
    const typeName = this.lookupType.find((item: any) => item?.id == typeId)?.type
    if(this.lookupId){
      const data =  {
        status: this.lookupForm.controls['status']?.value,
        typeId: this.lookupForm.controls['type']?.value,
        type: typeName,
        value: this.lookupForm.controls['value']?.value,
        description: this.lookupForm.controls['description']?.value,
        url: this.lookupForm.controls['url']?.value,
        actionBy: 'string',
      };
      this.lookupService.lookupUpdate(this.lookupId, data).subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success('Lookup ' + response.message);
          this.onCancel();
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
    } else {
 
    const data = {
      status: 'Active',
      typeId: this.lookupForm.controls['type']?.value,
      type: typeName,
      value: this.lookupForm.controls['value']?.value,
      description: this.lookupForm.controls['description']?.value,
      url: this.lookupForm.controls['url']?.value,
      actionBy: 'string',
    };
    this.lookupService.lookupCreate(data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Lookup' + response.message);
        this.onCancel();
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
    }
  }
}
