import { By } from '@angular/platform-browser';

export function byTestId(testId: string) {
  return By.css(`[data-testid="${testId}"]`);
}
