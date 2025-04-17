import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../core/service/lookup.service';
import { DomainProjectMappingService } from '../../../../core/service/domain-project-mapping.service';
import { UserMasterService } from '../../../../core/service/user-master.service';

@Component({
  selector: 'app-add-edit-domain-project-mapping',
  templateUrl: './add-edit-domain-project-mapping.component.html',
  styleUrl: './add-edit-domain-project-mapping.component.scss',
})
export class AddEditDomainProjectMappingComponent {
  domainProjectId: any;
  userId: string = '';
  loadSpinner: boolean = true;
  lookupType: any = [];
  domainNames: any = [];
  projectNames: any = [];
  offset = 0;
  count: number = Number.MAX_VALUE;
  domainProjectForm = new FormGroup({
    domain: new FormControl('', Validators.required),
    project: new FormControl('', Validators.required),
    projectManager: new FormControl(''),
    status: new FormControl(''),
  });
  userMaster: any=[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    private domainService: DomainProjectMappingService,
    private router: Router,
    private toastr: ToastrService,
    private userMasterService: UserMasterService
  ) {}

  ngOnInit(): void {
    this.domainProjectId = this.activatedRoute.snapshot.paramMap.get('id');
    const data = localStorage.getItem('data');
    if (data) {
      const dataObj = JSON.parse(data);
      this.userId = dataObj.userId;
    }
    // this.getLookupById();
    this.projectNameLookup();
    this.domainNameLookup();
    this.getProjectManager();
    if (this.domainProjectId) {
      this.getDomainProjectById();
    }
  }

  domainNameLookup() {
    const data = {
      status: '',
      type: 'domainName',
      value: '',
    };
    this.lookupService
      .lookupData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.domainNames = response?.lookUps;
          this.loadSpinner = false;
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
  }

  projectNameLookup() {
    const data = {
      status: '',
      type: 'projectName',
      value: '',
    };
    this.lookupService
      .lookupData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.projectNames = response?.lookUps;
          this.loadSpinner = false;
        },
        (error) => {
          this.loadSpinner = false;
        }
      );
  }

  getDomainProjectById() {
    this.domainService.domainProjectById(this.domainProjectId).subscribe(
      (response: any) => {
        this.domainProjectForm.patchValue({
          domain: response?.domainId,
          project: response?.projectId,
          projectManager: response?.projectManagerId,
          status: response?.status,
        });
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getProjectManager() {
    this.loadSpinner = true;
    const data = {
      id: '',
      name: '',
      userCategory: 'Project Manager',
    };
    this.userMasterService
      .userMasterData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.userMaster = response.users;
          this.loadSpinner = false;

          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onCancel() {
    this.router.navigate(['/masters/domain-project-mapping']);
  }

  onSave() {
    const projectId = this.domainProjectForm.controls['project']?.value;
    const projectNames = this.projectNames.find(
      (item: any) => item?.id == projectId
    )?.value;

    const domainId = this.domainProjectForm.controls['domain']?.value;
    const domainNames = this.domainNames.find(
      (item: any) => item?.id == domainId
    )?.value;

    const projectManagerId =
      this.domainProjectForm.controls['projectManager']?.value;
    // Correctly use 'name' property instead of 'value' for project manager's name
    const projectManagerName = this.userMaster.find(
      (item: any) => item.id === projectManagerId
    )?.name;

    if (this.domainProjectId) {
      this.loadSpinner = true;
      const data = {
        status: this.domainProjectForm.controls['status']?.value,
        actionBy: this.userId,
        projectManagerId: projectManagerId,
        projectManager: projectManagerName,
      };
      this.domainService
        .domainProjectUpdate(this.domainProjectId, data)
        .subscribe(
          (response: any) => {
            this.loadSpinner = false;
            this.toastr.success('Domain Project Mapping ' + response.message);
            this.onCancel();
          },
          (error) => {
            this.toastr.error(error?.error?.message, 'Error');
            this.loadSpinner = false;
          }
        );
    } else {
      this.loadSpinner = true;
      const data = {
        status: 'Active',
        domainId: domainId,
        domainName: domainNames,
        projectDetails: [
          {
            projectId: projectId,
            projectName: projectNames,
          },
        ],
        projectManagerId: projectManagerId,
        projectManager: projectManagerName,
        actionBy: this.userId,
      };
      this.domainService.domainProjectCreate(data).subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success('Domain Project Mapping ' + response.message);
          this.onCancel();
        },
        (error) => {
          this.toastr.error(error?.error?.message, 'Error');
          this.loadSpinner = false;
        }
      );
    }
  }
}
