import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildCourse, buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestEditGradesComponent } from './test-edit-grades.component';
import { CoursesRestService } from '../../../shared/services/courses-rest.service';
import {
  expectElementPresent,
  expectText,
} from '../../../../specs/expectations';
import { byTestId } from '../../../../specs/utils';

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

  it('should display external link to rating overview', () => {
    const field = fixture.debugElement.query(
      byTestId('link-to-rating-overview')
    ).nativeElement as HTMLLinkElement;

    expect(field).not.toBeNull();
    expect(field.href).toBe(
      'http://localhost:9876/link-to-evaluation-module.aspx?IDAnlass'
    );

    expectText(
      fixture.debugElement,
      'link-to-rating-overview',
      'tests.link-to-rating-overview'
    );
  });
});
