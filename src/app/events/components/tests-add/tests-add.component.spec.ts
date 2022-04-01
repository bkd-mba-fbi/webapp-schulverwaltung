import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { buildCourse } from 'src/spec-builders';
import { ActivatedRouteMock, buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';
import { TestsAddComponent } from './tests-add.component';

describe('TestsAddComponent', () => {
  let component: TestsAddComponent;
  let fixture: ComponentFixture<TestsAddComponent>;
  let activatedRouteMock: ActivatedRouteMock;
  let courseService: jasmine.SpyObj<CoursesRestService>;

  beforeEach(async () => {
    let course = buildCourse(1);

    activatedRouteMock = new ActivatedRouteMock({
      id: course.Id,
    });

    courseService = jasmine.createSpyObj('CoursesRestService', ['add']);
    courseService.add.and.returnValue(of());

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsAddComponent],
        providers: [
          TestStateService,
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: CoursesRestService, useValue: courseService },
        ],
      })
    ).compileComponents();
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
      date: new Date(),
      weight: 1,
      weightPercent: 1,
      isPointGrading: false,
      maxPoints: undefined,
      maxPointsAdjusted: undefined,
    };

    component.save(formGroupValue);

    expect(courseService.add).toHaveBeenCalledWith(
      1,
      formGroupValue.date,
      formGroupValue.designation,
      formGroupValue.weight,
      formGroupValue.isPointGrading,
      formGroupValue.maxPoints,
      formGroupValue.maxPointsAdjusted
    );
  });
});
