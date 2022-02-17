import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildCourse } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestsHeaderComponent } from './tests-header.component';

describe('TestsHeaderComponent', () => {
  let component: TestsHeaderComponent;
  let fixture: ComponentFixture<TestsHeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestsHeaderComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsHeaderComponent);
    component = fixture.componentInstance;
    component.course = buildCourse(123);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
