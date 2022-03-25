import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestStateComponent } from './test-state.component';

describe('TestStateComponent', () => {
  let component: TestStateComponent;
  let fixture: ComponentFixture<TestStateComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestStateComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
