import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatMenuModule, MatIconModule } from '@angular/material';

import { PainterCanvasComponent } from './painter-canvas.component';

describe('PainterCanvasComponent', () => {
  let fixture: ComponentFixture<PainterCanvasComponent>;
  let componentInstance: PainterCanvasComponent;
  let componentDe: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatMenuModule,
        MatIconModule,
      ],
      declarations: [
        PainterCanvasComponent,
      ],
    });

    fixture = TestBed.createComponent(PainterCanvasComponent);
    componentInstance = fixture.componentInstance;
    componentDe = fixture.debugElement;

    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(componentDe).toBeTruthy();
  });

  it('Should add text element', () => {
    const testText = 'Test Text';
    componentInstance.addText(testText);

    const canvasContent = componentInstance.toJSON();
    const textObj = canvasContent.objects.find(o => o.type === 'text');

    expect(textObj.text).toBe(testText);
  });
});
