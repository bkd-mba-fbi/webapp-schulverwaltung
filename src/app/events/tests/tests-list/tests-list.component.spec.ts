import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestsListComponent } from './tests-list.component';

describe('TestsListComponent', () => {
  let component: TestsListComponent;
  let fixture: ComponentFixture<TestsListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestsListComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
