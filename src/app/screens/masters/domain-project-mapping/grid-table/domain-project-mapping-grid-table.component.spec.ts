import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainProjectMappingGridTableComponent } from './domain-project-mapping-grid-table.component';

describe('DomainProjectMappingGridTableComponent', () => {
  let component: DomainProjectMappingGridTableComponent;
  let fixture: ComponentFixture<DomainProjectMappingGridTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomainProjectMappingGridTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomainProjectMappingGridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
