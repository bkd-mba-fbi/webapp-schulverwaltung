import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { TestTableHeaderComponent } from './test-table-header.component';

describe('TestTableHeaderComponent', () => {
  let component: TestTableHeaderComponent;
  let fixture: ComponentFixture<TestTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestTableHeaderComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    const test = buildTest(123, 345, []);
    fixture = TestBed.createComponent(TestTableHeaderComponent);
    component = fixture.componentInstance;
    component.test = test;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
