import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../core/service/lookup.service';
import { DomainProjectMappingService } from '../../../../core/service/domain-project-mapping.service';
import { UserMasterService } from '../../../../core/service/user-master.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-edit-domain-project-mapping',
  templateUrl: './add-edit-domain-project-mapping.component.html',
  styleUrl: './add-edit-domain-project-mapping.component.scss',
})
export class AddEditDomainProjectMappingComponent implements OnInit {
  domainProjectId: any;
  userId: string = '';
  loadSpinner: boolean = false;
  lookupType: any = [];
  domainNames: any = [];
  projectNames: any = [];
  formattedProjectNames: any = []; // For ng-multiselect-dropdown
  selectedProjects: any = []; // Store selected projects
  offset = 0;
  count: number = Number.MAX_VALUE;
  domainProjectForm = new FormGroup({
    domain: new FormControl('', Validators.required),
    project: new FormControl([], Validators.required), // Changed to array for multi-select
    projectManager: new FormControl('', Validators.required),
    status: new FormControl('Active'),
  });
  userMaster: any = [];
  dropdownSettings: IDropdownSettings = {};

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

    // Configure the dropdown settings
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    // First load lookup data and project managers
    this.loadLookupData().then(() => {
      // After data is loaded, get domain project details if in edit mode
      if (this.domainProjectId) {
        this.getDomainProjectById();
      }
    });
  }

  // Promise-based approach to ensure data is loaded before proceeding
  async loadLookupData() {
    try {
      await Promise.all([
        this.projectNameLookup(),
        this.domainNameLookup(),
        this.getProjectManager(),
      ]);
      console.log('All lookup data loaded successfully');
    } catch (error) {
      console.error('Error loading lookup data:', error);
    }
  }

  domainNameLookup() {
      const data = {
        status: '',
        type: 'domainName',
        value: '',
      };
      this.loadSpinner = true;

      this.lookupService
        .lookupData(this.userId, this.offset, this.count, data)
        .subscribe(
          (response: any) => {
            this.domainNames = response?.lookUps || [];
            this.loadSpinner = false;
          },
          (error) => {
            console.error('Error fetching domain names:', error);
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
    this.loadSpinner = true;

    this.lookupService
      .lookupData(this.userId, this.offset, this.count, data)
      .subscribe(
        (response: any) => {
          this.projectNames = response?.lookUps || [];

          // Format project names for ng-multiselect-dropdown
          this.formattedProjectNames = this.projectNames.map((project: any) => {
            return {
              id: project.id,
              name: project.value,
            };
          });

          console.log('Formatted project names:', this.formattedProjectNames);
          this.loadSpinner = false;
        },
        (error) => {
          console.error('Error fetching project names:', error);
          this.loadSpinner = false;
        }
      );
  }

  getProjectManager() {
    return new Promise((resolve, reject) => {
      const data = {
        id: '',
        name: '',
        userCategory: 'Project Manager',
      };
      this.loadSpinner = true;

      this.userMasterService
        .userMasterData(this.userId, this.offset, this.count, data)
        .subscribe(
          (response: any) => {
            this.userMaster = response.users || [];
            this.loadSpinner = false;
            resolve(true);
          },
          (error) => {
            console.error('Error fetching project managers:', error);
            this.loadSpinner = false;
            reject(error);
          }
        );
    });
  }

  getDomainProjectById() {
    this.loadSpinner = true;
    this.domainService.domainProjectById(this.domainProjectId).subscribe(
      (response: any) => {
        // console.log('Domain project details:', response);

        // Initialize selectedProjects array
        this.selectedProjects = [];
        if (
          response?.projectDetails &&
          Array.isArray(response.projectDetails) &&
          response.projectDetails.length > 0
        ) {
          this.selectedProjects = response.projectDetails.map(
            (project: any) => {
              return {
                id: project.projectId,
                name: project.projectName,
              };
            }
          );
        }
        else if (response?.projectId) {
          // Find project name from projectNames array
          const projectItem = this.projectNames.find(
            (item: any) => item.id === response.projectId
          );

          if (projectItem) {
            this.selectedProjects = [
              {
                id: response.projectId,
                name: projectItem.value,
              },
            ];
          }
        }
        // console.log('Selected projects for edit mode:', this.selectedProjects);

        // Set form values including the selected projects
        this.domainProjectForm.patchValue({
          domain: response?.domainId,
          project: this.selectedProjects,
          projectManager: response?.projectManagerId,
          status: response?.status || 'Active',
        });

        this.loadSpinner = false;
      },
      (error) => {
        console.error('Error fetching domain project details:', error);
        this.loadSpinner = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/masters/domain-project-mapping']);
  }

  onSave() {
    this.loadSpinner = true;
    if (!this.domainProjectForm.valid) {
      this.toastr.error('Please fill all required fields', 'Form Validation');
      return;
    }

    const selectedProjects = this.domainProjectForm.get('project')?.value;
    const domainId = this.domainProjectForm.get('domain')?.value;
    const domainName = this.domainNames.find(
      (item: any) => item?.id === domainId
    )?.value;

    const projectManagerId =
      this.domainProjectForm.get('projectManager')?.value;
    const projectManagerName = this.userMaster.find(
      (item: any) => item.id === projectManagerId
    )?.name;

    if (this.domainProjectId) {
      // Update existing domain project mapping
      // this.loadSpinner = true;
      const data = {
        status: this.domainProjectForm.get('status')?.value,
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
            this.toastr.error(
              error?.error?.message || 'Update failed',
              'Error'
            );
            this.loadSpinner = false;
          }
        );
    } else {
      // Create new domain project mapping

      // Format project details from selected projects
      const projectDetails = selectedProjects!.map((project: any) => {
        return {
          projectId: project.id,
          projectName: project.name,
        };
      });

      const data = {
        status: 'Active',
        domainId: domainId,
        domainName: domainName,
        projectDetails: projectDetails,
        projectManagerId: projectManagerId,
        projectManager: projectManagerName,
        actionBy: this.userId,
      };

      console.log('Creating domain project mapping with data:', data);

      this.domainService.domainProjectCreate(data).subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.toastr.success('Domain Project Mapping ' + response.message);
          this.onCancel();
        },
        (error) => {
          this.toastr.error(
            error?.error?.message || 'Creation failed',
            'Error'
          );
          this.loadSpinner = false;
        }
      );
    }
  }
}
