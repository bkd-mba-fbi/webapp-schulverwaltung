import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestsAddEntryComponent } from './tests-add-entry.component';

describe('TestsAddEntryComponent', () => {
  let component: TestsAddEntryComponent;
  let fixture: ComponentFixture<TestsAddEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsAddEntryComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsAddEntryComponent);
    component = fixture.componentInstance;
    component.test = buildTest(1, 2, []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoud get the factor', () => {
    component.test.Weight = 50;
    component.test.WeightPercent = 12.5;

    expect(component.factor).toBe('tests.add.factor 50 (12.5%)');
  });

  it('shoud get the grade type - grades', () => {
    component.test.IsPointGrading = false;
    component.test.MaxPoints = null;
    component.test.MaxPointsAdjusted = null;

    expect(component.gradeType).toBe('tests.add.grades');
  });

  it('shoud get the grade type - points', () => {
    component.test.IsPointGrading = true;
    component.test.MaxPoints = 30;
    component.test.MaxPointsAdjusted = null;

    expect(component.gradeType).toBe('tests.add.points (30)');
  });

  it('shoud get the grade type - points adjusted', () => {
    component.test.IsPointGrading = true;
    component.test.MaxPoints = 20.5;
    component.test.MaxPointsAdjusted = 18;

    expect(component.gradeType).toBe(
      'tests.add.points (18, tests.add.adjusted)'
    );
  });
});
