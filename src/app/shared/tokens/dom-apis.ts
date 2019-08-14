import { InjectionToken } from '@angular/core';

export const NAVIGATOR: InjectionToken<Navigator> = new InjectionToken(
  'Navigator API',
  {
    providedIn: 'root',
    factory: (): Navigator => navigator
  }
);
