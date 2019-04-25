import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
      ],
    }).compileComponents();
  }));

  it('Should create the app', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const appComponent = fixture.debugElement.componentInstance;
      expect(appComponent).toBeTruthy();
    }));
});
