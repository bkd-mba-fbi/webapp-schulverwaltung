import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash-es';
import { of } from 'rxjs';
import { buildCourse, buildResult, buildTest } from 'src/spec-builders';
import { ActivatedRouteMock, buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';

import { TestsEditComponent } from './tests-edit.component';

fdescribe('TestsEditComponent', () => {
  let component: TestsEditComponent;
  let fixture: ComponentFixture<TestsEditComponent>;
  let stateServiceMock: TestStateService;
  let activatedRouteMock: ActivatedRouteMock;
  let httpTestingController: HttpTestingController;

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

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsEditComponent],
        providers: [
          { provide: TestStateService, useValue: stateServiceMock },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
      })
    ).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
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
      date: '2022-02-09T00:00:00',
      weight: 2,
      weightPercent: 0.75,
      isPointGrading: true,
      maxPoints: 25,
      maxPointsAdjusted: 20,
    };

    component.save(formGroupValue);

    const body = {
      Tests: [
        {
          Id: 1,
          Date: formGroupValue.date,
          Designation: formGroupValue.designation,
          Weight: formGroupValue.weight,
          IsPointGrading: formGroupValue.isPointGrading,
          MaxPoints: formGroupValue.maxPoints,
          MaxPointsAdjusted: formGroupValue.maxPointsAdjusted,
        },
      ],
    };
    const url = `https://eventotest.api/Courses/1/Tests/Update`;

    httpTestingController
      .expectOne(
        (req) =>
          req.url === url && req.method === 'PUT' && isEqual(req.body, body),
        url
      )
      .flush(body);

    httpTestingController.verify();
  });

  it('should delete an existing test without results', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const test = buildTest(1, 1, []);

    component.delete(test);

    const url = `https://eventotest.api/Courses/1/Tests/Delete`;
    const body = {
      TestIds: [test.Id],
    };

    httpTestingController
      .expectOne(
        (req) =>
          req.url === url && req.method === 'PUT' && isEqual(req.body, body),
        url
      )
      .flush(body);

    httpTestingController.verify();

    expect(window.confirm).toHaveBeenCalledWith('tests.form.confirm');
  });

  it('should not delete an existing test with results', () => {
    spyOn(window, 'alert');
    const test = buildTest(1, 1, [buildResult(1, 33)]);

    component.delete(test);

    const url = `https://eventotest.api/Courses/1/Tests/Delete`;
    const body = {
      TestIds: [test.Id],
    };

    httpTestingController.expectNone(
      (req) =>
        req.url === url && req.method === 'PUT' && isEqual(req.body, body),
      url
    );

    httpTestingController.verify();

    expect(window.alert).toHaveBeenCalledWith('tests.form.delete-not-allowed');
  });
});
