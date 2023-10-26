import { DebugElement } from "@angular/core";
import { byTestId } from "./utils";

export function expectText(
  debugElement: DebugElement,
  testId: string,
  expected: string,
) {
  assertDebugElement(debugElement);

  const element = debugElement.query(byTestId(testId));
  if (!element) {
    console.error(debugElement.nativeElement.innerHTML);
    throw new Error(
      `unable to locate element with attribute [data-testid]=${testId} - see console to see an unformatted output of your current html`,
    );
  }

  expect(element.nativeElement.textContent.trim()).toBe(expected);
}

export function expectNotInTheDocument(
  debugElement: DebugElement,
  testId: string,
) {
  assertDebugElement(debugElement);
  expect(debugElement.query(byTestId(testId))).toBeNull();
}

export function expectElementPresent(
  debugElement: DebugElement,
  testId: string,
) {
  assertDebugElement(debugElement);
  expect(debugElement.query(byTestId(testId))).toBeTruthy();
}

function assertDebugElement(debugElement: DebugElement) {
  if (!debugElement)
    throw new Error(`The debugElement you gave me is not defined!
    You probably forgot to set it up in your beforeEach clause like this:

    debugElement = fixture.debugElement

    Please fix it and rerun your tests.
  `);
}
