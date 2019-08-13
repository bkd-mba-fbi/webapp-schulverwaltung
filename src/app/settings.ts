import { InjectionToken } from '@angular/core';
import * as t from 'io-ts';

const Settings = t.type({
  apiUrl: t.string,
  scriptsAndAssetsPath: t.string,
  absencePresenceTypeId: t.number,
  latePresenceTypeId: t.number,
  unconfirmedAbsenceStateId: t.number,
  unexcusedAbsenceStateId: t.number,
  excusedAbsenceStateId: t.number
});

type Settings = t.TypeOf<typeof Settings>;
export { Settings };

declare global {
  interface Window {
    absenzenmanagement: {
      settings: Settings;
    };
  }
}

export const SETTINGS = new InjectionToken<Settings>('Application Settings', {
  providedIn: 'root',
  factory: () => window.absenzenmanagement.settings
});
