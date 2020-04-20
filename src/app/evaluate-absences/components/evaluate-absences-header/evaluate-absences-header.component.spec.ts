import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAbsencesHeaderComponent } from './evaluate-absences-header.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';

describe('EvaluateAbsencesHeaderComponent', () => {
  let component: EvaluateAbsencesHeaderComponent;
  let fixture: ComponentFixture<EvaluateAbsencesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EvaluateAbsencesHeaderComponent],
        providers: [EvaluateAbsencesStateService],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
