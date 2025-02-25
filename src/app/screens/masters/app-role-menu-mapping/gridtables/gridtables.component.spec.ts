import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridtablesComponent } from './gridtables.component';

describe('GridtablesComponent', () => {
  let component: GridtablesComponent;
  let fixture: ComponentFixture<GridtablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridtablesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridtablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
