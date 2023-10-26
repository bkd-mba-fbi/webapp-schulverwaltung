import { InjectionToken } from "@angular/core";
import * as t from "io-ts";

import { Option } from "./shared/models/common-types";

const NotificationTypeText = t.type({
  de: t.type({ label: t.string, description: t.string }),
  fr: t.type({ label: t.string, description: t.string }),
});

const NotificationTypes = t.record(t.string, NotificationTypeText);

const NotificationTypesAssignment = t.type({
  roles: t.array(t.string),
  types: t.array(t.string),
});

const Dashboard = t.type({
  substitutionsAdminLink: t.string,
});

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
  lessonPresencesRefreshTime: t.number,
  unconfirmedAbsencesRefreshTime: Option(t.number),
  personMasterDataReportId: t.number,
  studentConfirmationReportId: t.number,
  evaluateAbsencesReportId: t.number,
  testsByCourseReportId: t.number,
  testsBySubscriptionReportIdStudent: t.number,
  testsBySubscriptionReportIdTeacher: t.number,
  subscriptionDetailGroupId: t.number,
  headerRoleRestriction: t.record(t.string, t.string),
  notificationRefreshTime: t.number,
  notificationTypes: NotificationTypes,
  notificationTypesAssignments: t.array(NotificationTypesAssignment),
  eventlist: t.record(t.string, t.string),
  dashboard: Dashboard,
  preventStudentAbsenceAfterLessonStart: t.array(t.string),
});

type Settings = t.TypeOf<typeof Settings>;
type NotificationTypeText = t.TypeOf<typeof NotificationTypeText>;
export { Settings, NotificationTypeText };

declare global {
  interface Window {
    schulverwaltung: {
      settings: Settings;
    };
  }
}

export const SETTINGS = new InjectionToken<Settings>("Application Settings", {
  providedIn: "root",
  factory: () => window.schulverwaltung.settings,
});
