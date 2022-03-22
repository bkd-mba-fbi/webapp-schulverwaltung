import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { buildCourse, buildTest } from 'src/spec-builders';
import { ActivatedRouteMock, buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';

import { TestsEditComponent } from './tests-edit.component';

describe('TestsEditComponent', () => {
  let component: TestsEditComponent;
  let fixture: ComponentFixture<TestsEditComponent>;
  let stateServiceMock: TestStateService;
  let activatedRouteMock: ActivatedRouteMock;

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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
