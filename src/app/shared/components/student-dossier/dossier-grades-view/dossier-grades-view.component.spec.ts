import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from 'src/app/shared/models/course.model';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectNotInTheDocument, expectText } from 'src/specs/expectations';
import { DossierGradesViewComponent } from './dossier-grades-view.component';

describe('DossierGradesViewComponent', () => {
  let component: DossierGradesViewComponent;
  let fixture: ComponentFixture<DossierGradesViewComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesViewComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should show message that indicates that there are no courses', () => {
    component.courses = [];

    fixture.detectChanges();

    expectText(debugElement, 'message-no-courses', 'dossier.no-courses');
  });

  it('should show designation of courses', () => {
    const courses: Course[] = [
      ({ Id: 111, Designation: 'course 1' } as unknown) as Course,
      ({ Id: 222, Designation: 'course 2' } as unknown) as Course,
    ];
    component.courses = courses;
    fixture.detectChanges();
    expectText(debugElement, 'course-designation-111', 'course 1, 111');
    expectText(debugElement, 'course-designation-222', 'course 2, 222');
    expectNotInTheDocument(debugElement, 'message-no-courses');
  });
});
