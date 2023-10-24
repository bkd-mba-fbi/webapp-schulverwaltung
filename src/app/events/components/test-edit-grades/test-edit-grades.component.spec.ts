import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { buildCourse } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import {
  expectElementPresent,
  expectNotInTheDocument,
} from '../../../../specs/expectations';
import { TestStateService } from '../../services/test-state.service';
import { TestEditGradesComponent } from './test-edit-grades.component';

describe('TestEditGradesComponent', () => {
  let component: TestEditGradesComponent;
  let fixture: ComponentFixture<TestEditGradesComponent>;

  let testStateServiceMock: jasmine.SpyObj<TestStateService>;

  const course = buildCourse(1234);

  beforeEach(waitForAsync(() => {
    testStateServiceMock = jasmine.createSpyObj('TestStateService', [
      'canSetFinalGrade$',
      'setSorting',
      'getSortingChar$',
      'course$',
    ]);

    testStateServiceMock.course$ = of(course);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestEditGradesComponent],
        providers: [
          {
            provide: TestStateService,
            useValue: testStateServiceMock,
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditGradesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button to set average as final grade', () => {
    testStateServiceMock.canSetFinalGrade$ = of(true);
    fixture.detectChanges();
    expectElementPresent(fixture.debugElement, 'apply-average-button');
  });

  it('should not show button to set average as final grade', () => {
    testStateServiceMock.canSetFinalGrade$ = of(false);
    fixture.detectChanges();
    expectNotInTheDocument(fixture.debugElement, 'apply-average-button');
  });
});
