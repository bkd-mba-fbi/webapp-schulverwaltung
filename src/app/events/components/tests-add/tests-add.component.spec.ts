import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash-es';
import { buildCourse } from 'src/spec-builders';
import { ActivatedRouteMock, buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';

import { TestsAddComponent } from './tests-add.component';

describe('TestsAddComponent', () => {
  let component: TestsAddComponent;
  let fixture: ComponentFixture<TestsAddComponent>;
  let activatedRouteMock: ActivatedRouteMock;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    let course = buildCourse(1);

    activatedRouteMock = new ActivatedRouteMock({
      id: course.Id,
    });

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsAddComponent],
        providers: [
          TestStateService,
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
      })
    ).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save new test', () => {
    const formGroupValue = {
      designation: 'a new test',
      date: '2022-02-09T00:00:00',
      weight: 1,
      weightPercent: 1,
      isPointGrading: false,
      maxPoints: null,
      maxPointsAdjusted: null,
    };

    component.save(formGroupValue);

    const body = {
      Tests: [
        {
          Date: formGroupValue.date,
          Designation: formGroupValue.designation,
          Weight: formGroupValue.weight,
          IsPointGrading: formGroupValue.isPointGrading,
          MaxPoints: formGroupValue.maxPoints,
          MaxPointsAdjusted: formGroupValue.maxPointsAdjusted,
        },
      ],
    };

    const url = `https://eventotest.api/Courses/1/Tests/New`;

    httpTestingController
      .expectOne(
        (req) =>
          req.url === url && req.method === 'PUT' && isEqual(req.body, body),
        url
      )
      .flush(body);

    httpTestingController.verify();
  });
});
