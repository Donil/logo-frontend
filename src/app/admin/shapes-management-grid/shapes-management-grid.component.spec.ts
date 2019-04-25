import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';

import { ShapesManagementGridComponent } from './shapes-management-grid.component';
import { ShapesService } from '../../core/services/shapes.service';

const ShapesServiceStub = {

}

const DialogServiceSpy = {

}

describe('ShapesManagementGridComponent', () => {
  let component: ShapesManagementGridComponent;
  let fixture: ComponentFixture<ShapesManagementGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapesManagementGridComponent ],
      providers: [
        { provide: ShapesService, useValue: ShapesServiceStub },
        { provide: MatDialog, useValue: DialogServiceSpy },
      ]
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
