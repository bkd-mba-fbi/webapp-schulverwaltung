import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAbsencesComponent } from './open-absences.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('OpenAbsencesComponent', () => {
  let component: OpenAbsencesComponent;
  let fixture: ComponentFixture<OpenAbsencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesComponent]
      })
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
