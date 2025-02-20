import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupFilterComponent } from './lookup-filter.component';

describe('LookupFilterComponent', () => {
  let component: LookupFilterComponent;
  let fixture: ComponentFixture<LookupFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LookupFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LookupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
