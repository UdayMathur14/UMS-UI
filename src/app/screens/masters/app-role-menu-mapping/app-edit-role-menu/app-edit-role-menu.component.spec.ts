import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEditRoleMenuComponent } from './app-edit-role-menu.component';

describe('AppEditRoleMenuComponent', () => {
  let component: AppEditRoleMenuComponent;
  let fixture: ComponentFixture<AppEditRoleMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppEditRoleMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppEditRoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
