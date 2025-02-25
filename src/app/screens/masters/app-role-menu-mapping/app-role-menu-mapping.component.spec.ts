import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRoleMenuMappingComponent } from './app-role-menu-mapping.component';

describe('AppRoleMenuMappingComponent', () => {
  let component: AppRoleMenuMappingComponent;
  let fixture: ComponentFixture<AppRoleMenuMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppRoleMenuMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppRoleMenuMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
