import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildCourse, buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestEditGradesComponent } from './test-edit-grades.component';

describe('TestEditGradesComponentComponent', () => {
  let component: TestEditGradesComponent;
  let fixture: ComponentFixture<TestEditGradesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestEditGradesComponent],
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
});
