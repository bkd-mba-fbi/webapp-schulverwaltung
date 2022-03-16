import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestsAddEntryComponent } from './tests-add-entry.component';

describe('TestsAddEntryComponent', () => {
  let component: TestsAddEntryComponent;
  let fixture: ComponentFixture<TestsAddEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsAddEntryComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsAddEntryComponent);
    component = fixture.componentInstance;
    component.test = buildTest(1, 2, []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
