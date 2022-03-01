import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestsEditComponent } from './tests-edit.component';

describe('TestsEditComponent', () => {
  let component: TestsEditComponent;
  let fixture: ComponentFixture<TestsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsEditComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
