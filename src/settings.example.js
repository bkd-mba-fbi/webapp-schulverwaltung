// Rename this file to settings.js and adjust the settings

window.schulverwaltung = window.schulverwaltung || {};

window.schulverwaltung.settings = {
  /**
   * General settings
   */
  // API base URL (without trailing slash)
  apiUrl: 'https://eventotest.api',

  // Path (without trailing slash, relative to the index.html) to the
  // JavaScript bundles and the assets directory containing image and
  // locale files
  scriptsAndAssetsPath: '.',

  // Maximum loaded entries per page, where pagination is in place
  paginationLimit: 200,

  /**
   * Presence types
   */
  // Id of the PresenceType that represents an absence without cause
  // (i.e. the default absence that will be used when changing state
  // in the presence control module)
  absencePresenceTypeId: 11,

  // Id of the PresenceType that represents the "late" incident
  latePresenceTypeId: 20,

  // Id of the PresenceType that represents the "dispensation" absence
  dispensationPresenceTypeId: 18,

  // Id of the PresenceType that represents the "half day" absence
  halfDayPresenceTypeId: 17,

  /**
   * Absence states
   */
  // Id of the confirmation state for absences that need to be
  // confirmed
  unconfirmedAbsenceStateId: 219,

  // Id of the confirmation state for absences without valid excuse
  unexcusedAbsenceStateId: 225,

  // Id of the confirmation state for absences with valid excuse
  excusedAbsenceStateId: 220,

  // Id of the confirmation state for absences that need to be checked
  checkableAbsenceStateId: 1080,

  // In presence control, a hint is shown if the student has
  // unconfirmed absences (in any lesson). These unconfirmed absences
  // are refreshed each time the user changes the date and in fixed
  // intervals afterwards (polling). Refresh time is in seconds and
  // may be set to `null` to disable polling (5 * 60 * 1000 = refresh
  // every 5 minutes).
  unconfirmedAbsencesRefreshTime: 5 * 60 * 1000,

  /**
   * Reports
   */
  // Id of the report that contains a user's master data (used in my profile)
  personMasterDataReportId: 290026,

  // Id of the report that contains the open absences with
  // confirmation values to sign (used in my absences)
  studentConfirmationReportId: 290036,

  // Id of the report used in evaluate absences
  evaluateAbsencesReportId: 290048,

  /**
   * Groups
   */
  // Id that determines if the group icon is shown on the presence control
  subscriptionDetailGroupId: 3843,

  // X-Role-Restriction custom HTTP header values by module
  headerRoleRestriction: {
    myAbsences: 'StudentRole',
    presenceControl: 'LessonTeacherRole;TeacherRole;ClassTeacherRole',
    openAbsences: 'LessonTeacherRole;ClassTeacherRole',
    editAbsences:
      'LessonTeacherRole;ClassTeacherRole;TeacherRole;AbsenceAdministratorRole',
  },

  /**
   * Notifications
   */
  // refresh time for notifications
  notificationRefreshTime: 30,

  /**
   * Events
   */
  // Link to the external event detail and evaluation modules.
  // The application will add the event id (IDAnlass) and the preceding equal sign,
  // e.g. link-to-event-detail-module.aspx?IDAnlass=1234
  eventlist: {
    eventdetail: 'link-to-event-detail-module.aspx?IDAnlass',
    evaluation: 'link-to-evaluation-module.aspx?IDAnlass',
  },
};
