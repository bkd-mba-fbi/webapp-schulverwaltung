import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OpenAbsencesComponent } from './open-absences.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('OpenAbsencesComponent', () => {
  let component: OpenAbsencesComponent;
  let fixture: ComponentFixture<OpenAbsencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
