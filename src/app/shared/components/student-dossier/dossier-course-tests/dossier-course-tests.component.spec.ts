import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course, FinalGrading } from 'src/app/shared/models/course.model';
import { FinalGrade } from 'src/app/shared/models/student-grades';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';
import { DossierCourseTestsComponent } from './dossier-course-tests.component';

describe('DossierCourseTestsComponent', () => {
  let component: DossierCourseTestsComponent;
  let fixture: ComponentFixture<DossierCourseTestsComponent>;
  let debugElement: DebugElement;

  let course: Course;
  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierCourseTestsComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    course = ({ Tests: [] } as unknown) as Course;

    fixture = TestBed.createComponent(DossierCourseTestsComponent);
    component = fixture.componentInstance;
    component.course = course;

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

  it('should get final grade for current student', () => {
    const expectedFinalGrading: FinalGrading = ({
      StudentId: 3,
      Grade: '5.0',
    } as unknown) as FinalGrading;

    const finalGrades = [
      ({ StudentId: 1, Grade: '4.5' } as unknown) as FinalGrading,
      ({ StudentId: 2, Grade: '4.0' } as unknown) as FinalGrading,
      expectedFinalGrading,
    ];
    course = ({ FinalGrades: finalGrades } as unknown) as Course;
    component.course = course;
    component.studentId = expectedFinalGrading.StudentId;
    fixture.detectChanges();

    expect(component.getFinalGradeForStudent()).toEqual(expectedFinalGrading);
  });
});
