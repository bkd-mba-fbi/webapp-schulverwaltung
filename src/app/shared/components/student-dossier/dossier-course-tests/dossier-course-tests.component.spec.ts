import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from 'src/app/shared/models/course.model';
import { buildCourse } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';
import { DossierCourseTestsComponent } from './dossier-course-tests.component';

describe('DossierCourseTestsComponent', () => {
  let component: DossierCourseTestsComponent;
  let fixture: ComponentFixture<DossierCourseTestsComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierCourseTestsComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierCourseTestsComponent);
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
