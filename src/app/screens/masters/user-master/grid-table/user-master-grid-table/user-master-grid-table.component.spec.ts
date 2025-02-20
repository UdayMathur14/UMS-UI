import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMasterGridTableComponent } from './user-master-grid-table.component';

describe('UserMasterGridTableComponent', () => {
  let component: UserMasterGridTableComponent;
  let fixture: ComponentFixture<UserMasterGridTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserMasterGridTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMasterGridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
