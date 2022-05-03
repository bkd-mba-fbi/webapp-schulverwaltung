import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from 'src/app/shared/models/course.model';
import { buildCourse } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';
import { DossierCourseEntryComponent } from './dossier-course-entry.component';

describe('DossierCourseEntryComponent', () => {
  let component: DossierCourseEntryComponent;
  let fixture: ComponentFixture<DossierCourseEntryComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierCourseEntryComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierCourseEntryComponent);
    component = fixture.componentInstance;
    component.course = buildCourse(1234);
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show message course has no tests', () => {
    const course: Course = ({ Tests: [] } as unknown) as Course;
    component.course = course;
    fixture.detectChanges();
    expectText(debugElement, 'message-no-tests', 'dossier.no-tests');
  });
});
