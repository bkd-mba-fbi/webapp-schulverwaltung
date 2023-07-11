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

  // In presences control, the presence data of the selected lesson is
  // reloaded for the following interval, if there is no user activity
  // (such as clicks or keypresses). Refresh time is in seconds (15 *
  // 60 * 1000 ? refresh every 15 minutes of inactivity).
  lessonPresencesRefreshTime: 15 * 60 * 1000,

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

  // Id of the report used for the course report
  testsByCourseReportId: 290044,

  // Id of the report used for the tests report for a single student
  testsBySubscriptionReportIdStudent: 290043,
  testsBySubscriptionReportIdTeacher: 290042,

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
  // Refresh time for notifications
  notificationRefreshTime: 30,

  // Types of notifications and their language-specific texts
  // (the description may contain newlines '\n')
  notificationTypes: {
    BM2Student: {
      de: {
        label: 'Präsenz im BM-Unterricht',
        description:
          'Sie haben eine Präsenz von <= 85% in einem Fach erreicht.',
      },
      fr: {
        label: 'Présence dans les cours de BM',
        description:
          'Vous avez atteint un taux de présence <= 85% dans une matière.',
      },
    },
    gradePublish: {
      de: {
        label: 'Note publiziert',
        description: 'Eine Note aus einem Test wurde publiziert.',
      },
      fr: {
        label: 'Note publiée',
        description: "Une note obtenue lors d'un test a été publiée.",
      },
    },
    absenceMessage: {
      de: {
        label: 'Absenzenmeldung',
        description:
          'Fachlehrpersonen: Abwesenheit von Lernenden\nKlassenlehrperson: Antrag freier Halbtag',
      },
      fr: {
        label: 'Déclaration des absences',
        description:
          "Fachlehrpersonen: Absence d'apprenants\nEnseignant de classe : demande de demi-journée libre",
      },
    },
    absenceMessageTeacher: {
      de: {
        label: 'Absenz erfasst (Lehrperson)',
        description:
          'Klassenlehrperson: Jemand anderes als die Lernenden erfasst einen Absenz ohne Grund.',
      },
      fr: {
        label: 'Absence saisie (enseignant)',
        description:
          "Enseignant(e) de classe : quelqu'un d'autre que les apprenants saisit un motif d'absence.",
      },
    },
    teacherSubstitutions: {
      de: {
        label: 'Stellvertretung',
        description:
          'Lehrperson: Sie wurden als Stellvertretung für eine andere Lehrperson erfasst.',
      },
      fr: {
        label: 'Suppléance',
        description:
          "Enseignant(e) : vous avez été saisi(e) en tant que remplaçant(e) d'un autre enseignant.",
      },
    },
    BM2Teacher: {
      de: {
        label: 'Präsenz im BM-Unterricht',
        description:
          'Ein/e Lernende/r hat eine Präsenz von <= 85% in einem Fach erreicht.',
      },
      fr: {
        label: 'Présence dans les cours de BM',
        description:
          'Un(e) apprenti(e) a atteint un taux de présence <= 85% dans une matière.',
      },
    },
  },

  notificationTypesAssignments: [
    {
      roles: ['StudentRole'],
      types: ['BM2Student', 'gradePublish'],
    },
    {
      roles: ['LessonTeacherRole', 'ClassTeacherRole', 'TeacherRole'],
      types: [
        'BM2Teacher',
        'absenceMessage',
        'absenceMessageTeacher',
        'teacherSubstitutions',
      ],
    },
  ],

  /**
   * Events
   */
  eventlist: {
    // Links to the external event detail and evaluation modules.
    // The application will replace the placeholder ':id' with the
    // corresponding event id
    eventdetail: 'link-to-event-detail-module/:id',
    evaluation: 'link-to-evaluation-module/:id',

    // Only events with a status id in the following list are fetched
    statusfilter:
      '14030;14025;14017;14020;10350;10335;10355;10315;10330;10325;10320;10340;10345;10230;10225;10240;10250;10260;10217;10235;10220;10226;10227;10250;10300;10305;10310',
  },

  /**
   * Dashboard
   */
  dashboard: {
    substitutionsAdminLink: 'link-to-substitutions-admin-module',
  },

  /**
   * My absences
   */
  // Instance IDs of schools where students cannot report absences after lessons have started
  preventStudentAbsenceAfterLessonStart: [],
};
