import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradeComponent } from './grade.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { buildResult, buildTest } from '../../../../spec-builders';
import { GradeOrNoResult } from 'src/app/shared/models/student-grades';

describe('GradeComponent', () => {
  let component: GradeComponent;
  let fixture: ComponentFixture<GradeComponent>;

  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [GradeComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const grade: GradeOrNoResult = {
      kind: 'grade',
      result: buildResult(120, 140),
      test: buildTest(100, 120, [buildResult(120, 140)]),
    };

    component.grade = grade;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create with noResult', () => {
    const noResult: GradeOrNoResult = {
      kind: 'no-result',
      TestId: 120,
    };

    component.grade = noResult;

    expect(component).toBeTruthy();
    expect(component.grade).toBe(noResult);
  });

  it('should show points', () => {
    const grade: GradeOrNoResult = {
      kind: 'grade',
      result: buildResult(120, 140),
      test: buildTest(100, 120, [buildResult(120, 140)]),
    };

    grade.test.IsPointGrading = true;
    grade.result.Points = 11;

    component.grade = grade;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.point-input');

    expect(input.value).toContain(11);
  });
});
