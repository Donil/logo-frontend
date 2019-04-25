import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogTitle, MatDialogContent } from '@angular/material';
import { By } from '@angular/platform-browser';

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog.component';

const matDialogRefSpy = {
  close: jasmine.createSpy('close'),
};

const matDialogDataStub: ConfirmDialogData = {
  confimButtonText: 'Confirm',
  message: 'Message',
  rejectButtonText: 'Reject',
  title: 'Title',
};

describe('ConfirmDialogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
      ],
      declarations: [
        ConfirmDialogComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataStub },
      ],
    });
  });

  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let componentInstance: ConfirmDialogComponent;
  let componentDe: DebugElement;
  let confirmButtonDe: DebugElement;
  let rejectButtonDe: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    componentInstance = fixture.componentInstance;
    componentDe = fixture.debugElement;
    fixture.detectChanges();
    confirmButtonDe = componentDe.query(By.css('button:nth-child(1)'));
    rejectButtonDe = componentDe.query(By.css('button:nth-child(2)'));
  });

  it('Should create', () => {
    expect(componentInstance).toBeTruthy();
  });

  it('Instance should contains correct content', () => {
    expect(componentInstance.confirmButtonText).toBe(matDialogDataStub.confimButtonText);
    expect(componentInstance.message).toBe(matDialogDataStub.message);
    expect(componentInstance.rejectButtonText).toBe(matDialogDataStub.rejectButtonText);
    expect(componentInstance.title).toBe(matDialogDataStub.title);
  });

  it('DOM elements should contains correct content', () => {
    const titleDe = fixture.debugElement.query(By.directive(MatDialogTitle));
    const contentDe = fixture.debugElement.query(By.directive(MatDialogContent));

    expect((titleDe.nativeElement as HTMLElement).innerText).toBe(matDialogDataStub.title);
    expect((contentDe.nativeElement as HTMLElement).innerText).toBe(matDialogDataStub.message);
    expect((confirmButtonDe.nativeElement as HTMLElement).innerText).toBe(matDialogDataStub.confimButtonText);
    expect((rejectButtonDe.nativeElement as HTMLElement).innerText).toBe(matDialogDataStub.rejectButtonText);
  });

  it('Confirm and reject buttons should close dialog', () => {
    confirmButtonDe.triggerEventHandler('click', null);
    expect(matDialogRefSpy.close).toHaveBeenCalledWith(true);
    matDialogRefSpy.close.calls.reset();
    rejectButtonDe.triggerEventHandler('click', null);
    expect(matDialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
