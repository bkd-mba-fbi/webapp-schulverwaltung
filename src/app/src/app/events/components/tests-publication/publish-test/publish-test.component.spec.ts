import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fi } from 'date-fns/locale';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { PublishTestComponent } from './publish-test.component';

describe('PublishTestComponent', () => {
  let component: PublishTestComponent;
  let fixture: ComponentFixture<PublishTestComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PublishTestComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishTestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    // given
    component.test = buildTest(1, 1, []);

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
  });

  describe('show correct confirmation messages', () => {
    it('should show correct message for unpublished tests', () => {
      // given
      component.test = buildTest(1, 1, []);

      // when
      fixture.detectChanges();

      // then
      expectConfirmationMessage(debugElement, 'tests.publishing.publish');
    });

    it('should show correct message for published tests', () => {
      // given
      const publishedTest = buildTest(1, 1, []);
      publishedTest.IsPublished = true;
      component.test = publishedTest;

      // when
      fixture.detectChanges();

      // then
      expectConfirmationMessage(debugElement, 'tests.publishing.unpublish');
    });
  });
});

function expectConfirmationMessage(
  debugElement: DebugElement,
  expected: string
) {
  const confirmationMessageElement = debugElement.query(
    By.css('[data-testid="confirmation-message"]')
  );
  expect(confirmationMessageElement.nativeElement.textContent.trim()).toBe(
    expected
  );
}
