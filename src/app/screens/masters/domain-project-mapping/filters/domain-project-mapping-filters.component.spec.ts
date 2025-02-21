import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainProjectMappingFiltersComponent } from './domain-project-mapping-filters.component';

describe('DomainProjectMappingFiltersComponent', () => {
  let component: DomainProjectMappingFiltersComponent;
  let fixture: ComponentFixture<DomainProjectMappingFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomainProjectMappingFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomainProjectMappingFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
