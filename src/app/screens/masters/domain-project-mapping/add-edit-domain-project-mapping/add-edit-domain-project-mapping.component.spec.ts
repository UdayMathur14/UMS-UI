import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDomainProjectMappingComponent } from './add-edit-domain-project-mapping.component';

describe('AddEditDomainProjectMappingComponent', () => {
  let component: AddEditDomainProjectMappingComponent;
  let fixture: ComponentFixture<AddEditDomainProjectMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditDomainProjectMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditDomainProjectMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
