import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMasterFilterComponent } from './user-master-filter.component';

describe('UserMasterFilterComponent', () => {
  let component: UserMasterFilterComponent;
  let fixture: ComponentFixture<UserMasterFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserMasterFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMasterFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
