import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildCourse, buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestEditGradesComponent } from './test-edit-grades.component';
import { CoursesRestService } from '../../../shared/services/courses-rest.service';
import { expectElementPresent } from '../../../../specs/expectations';

describe('TestEditGradesComponent', () => {
  let component: TestEditGradesComponent;
  let fixture: ComponentFixture<TestEditGradesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestEditGradesComponent],
          providers: [CoursesRestService],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditGradesComponent);
    component = fixture.componentInstance;

    component.course = buildCourse(1);
    component.tests = [buildTest(1, 12, [])];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button to set average as final grade', () => {
    expectElementPresent(fixture.debugElement, 'apply-average-button');
  });
});
