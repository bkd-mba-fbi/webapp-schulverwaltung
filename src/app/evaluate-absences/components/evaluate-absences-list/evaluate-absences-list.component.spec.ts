import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EvaluateAbsencesListComponent } from './evaluate-absences-list.component';

describe('EvaluateAbsencesListComponent', () => {
  let component: EvaluateAbsencesListComponent;
  let fixture: ComponentFixture<EvaluateAbsencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EvaluateAbsencesListComponent]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
