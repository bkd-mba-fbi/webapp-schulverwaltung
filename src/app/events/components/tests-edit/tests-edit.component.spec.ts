import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { buildCourse, buildTest } from 'src/spec-builders';
import { ActivatedRouteMock, buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';
import { TestsEditFormComponent } from '../tests-edit-form/tests-edit-form.component';

import { TestsEditComponent } from './tests-edit.component';

describe('TestsEditComponent', () => {
  let component: TestsEditComponent;
  let fixture: ComponentFixture<TestsEditComponent>;
  let stateServiceMock: TestStateService;
  let activatedRouteMock: ActivatedRouteMock;
  let courseRestServiceMock: jasmine.SpyObj<CoursesRestService>;

  beforeEach(async () => {
    let course = buildCourse(1234);
    let test = buildTest(1234, 1, []);
    course.Tests = [test];

    activatedRouteMock = new ActivatedRouteMock({
      id: course.Id,
      testId: course.Tests[0].Id,
    });

    stateServiceMock = ({
      loading$: of(false),
      courseId$: of(course.Id),
      tests$: of([test]),
      testsId$: of(test.Id),
      getCourse: () => of(course),
    } as unknown) as TestStateService;

    courseRestServiceMock = jasmine.createSpyObj('CoursesRestService', [
      'update',
    ]);
    courseRestServiceMock.update.and.returnValue(of());

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsEditComponent, TestsEditFormComponent],
        providers: [
          { provide: TestStateService, useValue: stateServiceMock },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: CoursesRestService, useValue: courseRestServiceMock },
        ],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update existing test', () => {
    const formGroupValue = {
      designation: 'an updated test',
      date: new Date(),
      weight: 2,
      isPointGrading: true,
      maxPoints: 25,
      maxPointsAdjusted: 20,
    };

    component.save(formGroupValue);

    expect(courseRestServiceMock.update).toHaveBeenCalledWith(
      1234,
      1,
      formGroupValue.designation,
      formGroupValue.date,
      formGroupValue.weight,
      formGroupValue.isPointGrading,
      formGroupValue.maxPoints,
      formGroupValue.maxPointsAdjusted
    );
  });
});
