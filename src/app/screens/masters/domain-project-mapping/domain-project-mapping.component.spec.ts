import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainProjectMappingComponent } from './domain-project-mapping.component';

describe('DomainProjectMappingComponent', () => {
  let component: DomainProjectMappingComponent;
  let fixture: ComponentFixture<DomainProjectMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomainProjectMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomainProjectMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
