import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesManagementGridComponent } from './shapes-management-grid.component';

describe('ShapesManagementGridComponent', () => {
  let component: ShapesManagementGridComponent;
  let fixture: ComponentFixture<ShapesManagementGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapesManagementGridComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapesManagementGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
