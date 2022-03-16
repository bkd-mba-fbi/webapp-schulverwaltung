import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestsAddHeaderComponent } from './tests-add-header.component';

describe('TestsAddHeaderComponent', () => {
  let component: TestsAddHeaderComponent;
  let fixture: ComponentFixture<TestsAddHeaderComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsAddHeaderComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsAddHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    hostElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show grading scale if no tests', () => {
    expect(hostElement.textContent).not.toContain('tests.add.grading-scale:');
  });

  it('should show grading scale', () => {
    const test = buildTest(1, 2, []);
    component.tests = [{ ...test, GradingScale: 'scale' }];
    fixture.detectChanges();

    expect(hostElement.textContent).toContain('tests.add.grading-scale: scale');
  });
});
