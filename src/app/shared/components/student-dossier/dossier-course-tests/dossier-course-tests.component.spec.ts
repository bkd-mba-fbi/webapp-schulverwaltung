import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Course,
  FinalGrading,
  Grading,
} from 'src/app/shared/models/course.model';
import { Grade, GradingScale } from 'src/app/shared/models/grading-scale.model';
import { FinalGrade } from 'src/app/shared/models/student-grades';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';
import { DossierCourseTestsComponent } from './dossier-course-tests.component';

describe('DossierCourseTestsComponent', () => {
  let component: DossierCourseTestsComponent;
  let fixture: ComponentFixture<DossierCourseTestsComponent>;
  let debugElement: DebugElement;

  let course: Course;
  let gradingScale: GradingScale;
  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierCourseTestsComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    course = ({ Tests: [] } as unknown) as Course;
    gradingScale = ({
      Grades: [],
    } as unknown) as GradingScale;
    fixture = TestBed.createComponent(DossierCourseTestsComponent);
    component = fixture.componentInstance;
    component.course = course;
    component.gradingScales = [gradingScale];

    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show message course has no tests', () => {
    course = ({ Tests: [] } as unknown) as Course;
    component.course = course;
    fixture.detectChanges();
    expectText(debugElement, 'message-no-tests', 'dossier.no-tests');
  });
});
