import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Course,
  FinalGrading,
  Grading,
} from 'src/app/shared/models/course.model';
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

  describe('get gradings for the current student', () => {
    const expectedFinalGrading: FinalGrading = ({
      StudentId: 3,
      Grade: '5.0',
    } as unknown) as FinalGrading;

    const finalGrades = [
      ({ StudentId: 1, Grade: '4.5' } as unknown) as FinalGrading,
      ({ StudentId: 2, Grade: '4.0' } as unknown) as FinalGrading,
      expectedFinalGrading,
    ];

    const expectedGrading: Grading = ({
      StudentId: 44,
    } as unknown) as Grading;
    const gradings: Grading[] = [
      ({ StudentId: 33 } as unknown) as Grading,
      ({ StudentId: 55 } as unknown) as Grading,
      expectedGrading,
    ];

    beforeEach(() => {
      course = ({
        FinalGrades: finalGrades,
        Gradings: gradings,
      } as unknown) as Course;
      component.course = course;
    });

    it('should not find a final grade if studentid does not match', () => {
      component.studentId = -1;
      fixture.detectChanges();

      expect(component.getFinalGradeForStudent()).toBeUndefined();
    });

    it('should not find a grading if studentid does not match', () => {
      component.studentId = -1;
      fixture.detectChanges();

      expect(component.getGradingForStudent()).toBeUndefined();
    });

    it('should get final grade for current student', () => {
      component.studentId = expectedFinalGrading.StudentId;
      fixture.detectChanges();

      expect(component.getFinalGradeForStudent()).toEqual(expectedFinalGrading);
    });

    it('should get the grading for the current student', () => {
      component.studentId = expectedGrading.StudentId;
      fixture.detectChanges();

      expect(component.getGradingForStudent()).toEqual(expectedGrading);
    });
  });
});
