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
  scriptsPath: string;
  assetsPath: string;
  absencePresenceTypeId: number;
  latePresenceTypeId: number;
  unconfirmedAbsenceStateId: number;
}

export const SETTINGS = new InjectionToken<Settings>('Application Settings', {
  providedIn: 'root',
  factory: () => window.absenzenmanagement.settings
});
