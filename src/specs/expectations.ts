import { DebugElement } from '@angular/core';
import { byTestId } from './utils';

export function expectText(
  debugElement: DebugElement,
  testId: string,
  expected: string
) {
  expect(
    debugElement.query(byTestId(testId)).nativeElement.textContent.trim()
  ).toBe(expected);
}

export function expectNotInTheDocument(
  debugElement: DebugElement,
  testId: string
) {
  expect(debugElement.query(byTestId(testId))).toBeNull();
}
