import { InjectionToken } from '@angular/core';
import * as t from 'io-ts';

import { Option } from './shared/models/common-types';

const Settings = t.type({
  apiUrl: t.string,
  scriptsAndAssetsPath: t.string,
  paginationLimit: t.number,
  absencePresenceTypeId: t.number,
  latePresenceTypeId: t.number,
  dispensationPresenceTypeId: t.number,
  halfDayPresenceTypeId: t.number,
  unconfirmedAbsenceStateId: t.number,
  unexcusedAbsenceStateId: t.number,
  excusedAbsenceStateId: t.number,
  checkableAbsenceStateId: t.number,
  unconfirmedAbsencesRefreshTime: Option(t.number),
  personMasterDataReportId: t.number,
  studentConfirmationReportId: t.number,
  headerRoleRestriction: t.record(t.string, t.string),
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
  factory: () => window.absenzenmanagement.settings,
});
