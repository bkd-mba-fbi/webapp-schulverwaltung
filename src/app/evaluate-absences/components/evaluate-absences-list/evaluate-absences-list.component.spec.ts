import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAbsencesListComponent } from './evaluate-absences-list.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';

describe('EvaluateAbsencesListComponent', () => {
  let component: EvaluateAbsencesListComponent;
  let fixture: ComponentFixture<EvaluateAbsencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EvaluateAbsencesListComponent],
        providers: [EvaluateAbsencesStateService]
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
