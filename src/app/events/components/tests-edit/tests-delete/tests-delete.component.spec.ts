import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsDeleteComponent } from './tests-delete.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { buildTestModuleMetadata } from '../../../../../spec-helpers';
import { buildResult, buildTest } from 'src/spec-builders';
import { byTestId } from '../../../../../specs/spec-utils';
import { DebugElement } from '@angular/core';

describe('TestsDeleteComponent', () => {
  let component: TestsDeleteComponent;
  let fixture: ComponentFixture<TestsDeleteComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsDeleteComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsDeleteComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create with no results', () => {
    component.test = buildTest(100, 10, []);

    fixture.detectChanges();

    expect(
      debugElement
        .query(byTestId('confirmation-message'))
        .nativeElement.textContent.trim()
    ).toBe('tests.form.confirm');

    expect(
      debugElement
        .query(byTestId('cancel-button'))
        .nativeElement.textContent.trim()
    ).toBe('tests.dialog.no');

    expect(
      debugElement
        .query(byTestId('confirm-button'))
        .nativeElement.textContent.trim()
    ).toBe('tests.dialog.yes');

    expect(component.canDeleteTest).toBeTrue();
    expect(component).toBeTruthy();
  });

  it('should create with result', () => {
    component.test = buildTest(100, 10, [buildResult(10, 20)]);

    fixture.detectChanges();

    expect(
      debugElement
        .query(byTestId('confirmation-message'))
        .nativeElement.textContent.trim()
    ).toBe('tests.form.delete-not-allowed');

    expect(
      debugElement
        .query(byTestId('confirm-button'))
        .nativeElement.textContent.trim()
    ).toBe('tests.dialog.ok');

    expect(component.canDeleteTest).toBeFalse();
    expect(component).toBeTruthy();
  });
});
