import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { buildTest } from 'src/spec-builders';
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
    component.test = buildTest(1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
