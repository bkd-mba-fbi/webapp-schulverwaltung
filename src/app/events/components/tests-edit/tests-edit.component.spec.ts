import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { buildCourse, buildResult, buildTest } from 'src/spec-builders';
import { ActivatedRouteMock, buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';

import { TestsEditComponent } from './tests-edit.component';

describe('TestsEditComponent', () => {
  let component: TestsEditComponent;
  let fixture: ComponentFixture<TestsEditComponent>;
  let stateServiceMock: TestStateService;
  let activatedRouteMock: ActivatedRouteMock;
  let courseService: jasmine.SpyObj<CoursesRestService>;

  beforeEach(async () => {
    let course = buildCourse(1);
    course.Tests = [buildTest(1, 1, [])];

    activatedRouteMock = new ActivatedRouteMock({
      id: course.Id,
      testId: course.Tests[0].Id,
    });

    stateServiceMock = ({
      loading$: of(false),
      getCourse: () => of(course),
    } as unknown) as TestStateService;

    courseService = jasmine.createSpyObj('CoursesRestService', [
      'update',
      'delete',
    ]);
    courseService.update.and.returnValue(of());
    courseService.delete.and.returnValue(of());

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsEditComponent],
        providers: [
          { provide: TestStateService, useValue: stateServiceMock },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: CoursesRestService, useValue: courseService },
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

    expect(courseService.update).toHaveBeenCalledWith(
      1,
      1,
      formGroupValue.designation,
      formGroupValue.date,
      formGroupValue.weight,
      formGroupValue.isPointGrading,
      formGroupValue.maxPoints,
      formGroupValue.maxPointsAdjusted
    );
  });

  it('should delete an existing test without results', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const test = buildTest(1, 1, []);

    component.delete(test);

    expect(courseService.delete).toHaveBeenCalledWith(1, 1);
    expect(window.confirm).toHaveBeenCalledWith('tests.form.confirm');
  });

  it('should not delete an existing test with results', () => {
    spyOn(window, 'alert');
    const test = buildTest(1, 1, [buildResult(1, 33)]);

    component.delete(test);

    expect(courseService.delete).not.toHaveBeenCalledWith(1, 1);
    expect(window.alert).toHaveBeenCalledWith('tests.form.delete-not-allowed');
  });
});