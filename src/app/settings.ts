import { InjectionToken } from '@angular/core';

declare global {
  interface Window {
    absenzenmanagement: {
      settings: Settings;
    };
  }
}

export interface Settings {
  apiUrl: string;
  scriptsAndAssetsPath: string;
  absencePresenceTypeId: number;
  latePresenceTypeId: number;
  unconfirmedAbsenceStateId: number;
}

export const SETTINGS = new InjectionToken<Settings>('Application Settings', {
  providedIn: 'root',
  factory: () => window.absenzenmanagement.settings
});
