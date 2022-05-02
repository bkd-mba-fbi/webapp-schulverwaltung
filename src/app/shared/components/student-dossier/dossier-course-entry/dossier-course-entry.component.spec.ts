import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildCourse } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DossierCourseEntryComponent } from './dossier-course-entry.component';

describe('DossierCourseEntryComponent', () => {
  let component: DossierCourseEntryComponent;
  let fixture: ComponentFixture<DossierCourseEntryComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
