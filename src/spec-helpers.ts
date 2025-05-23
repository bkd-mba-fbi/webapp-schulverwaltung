import { HttpClient, provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { SimpleChange, SimpleChanges } from "@angular/core";
import { TestModuleMetadata } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  ParamMap,
  Params,
  convertToParamMap,
  provideRouter,
} from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ReplaySubject } from "rxjs";
import { SETTINGS, Settings } from "./app/settings";
import { AuthService } from "./app/shared/services/auth.service";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/locales/", ".json");
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export const settings: Settings = {
  apiUrl: "https://eventotest.api",
  scriptsAndAssetsPath: ".",
  paginationLimit: 1000,
  absencePresenceTypeId: 11,
  latePresenceTypeId: 12,
  dispensationPresenceTypeId: 18,
  halfDayPresenceTypeId: 17,
  unconfirmedAbsenceStateId: 219,
  unexcusedAbsenceStateId: 225,
  excusedAbsenceStateId: 220,
  checkableAbsenceStateId: 1080,
  lessonPresencesRefreshTime: 15 * 60 * 1000,
  unconfirmedAbsencesRefreshTime: null,
  personMasterDataReports: [{ type: "crystal", id: 290026 }],
  studentConfirmationReports: [{ type: "crystal", id: 290036 }],
  evaluateAbsencesReports: [
    { type: "crystal", id: 290048 },
    { type: "excel", id: 290033 },
  ],
  myAbsencesReports: [{ type: "crystal", id: 290048 }],
  testsByCourseReports: [{ type: "crystal", id: 290044 }],
  testsBySubscriptionStudentReports: [{ type: "crystal", id: 290043 }],
  testsBySubscriptionTeacherReports: [{ type: "crystal", id: 290042 }],
  evaluationReports: [{ type: "crystal", id: 290045 }],
  studyClassStudentsReports: [
    { type: "crystal", id: 290049 },
    { type: "crystal", id: 290044 },
    { type: "crystal", id: 230049 },
  ],
  courseStudentsReports: [
    { type: "crystal", id: 290049 },
    { type: "crystal", id: 290044 },
    { type: "excel", id: 290040 },
    { type: "excel", id: 240001 },
    { type: "excel", id: 250004 },
  ],
  subscriptionDetailGroupId: 3843,
  headerRoleRestriction: {
    myAbsences: "StudentRole",
    presenceControl: "LessonTeacherRole",
    openAbsences: "LessonTeacherRole;ClassTeacherRole",
    editAbsences: "LessonTeacherRole;ClassTeacherRole",
  },
  notificationTypes: {
    BM2Student: {
      de: {
        label: "BM2Student label de",
        description: "BM2Student description de",
      },
      fr: {
        label: "BM2Student label fr",
        description: "BM2Student description fr",
      },
    },
    gradePublish: {
      de: {
        label: "gradePublish label de",
        description: "gradePublish description de",
      },
      fr: {
        label: "gradePublish label fr",
        description: "gradePublish description fr",
      },
    },
  },
  notificationTypesAssignments: [
    {
      roles: ["StudentRole"],
      types: ["BM2Student", "gradePublish"],
    },
    {
      roles: ["LessonTeacherRole", "ClassTeacherRole", "TeacherRole"],
      types: [
        "BM2Teacher",
        "absenceMessage",
        "absenceMessageTeacher",
        "teacherSubstitutions",
      ],
    },
  ],
  eventlist: {
    statusfilter:
      "14030;14025;14017;14020;10350;10335;10355;10315;10330;1032510320;10340;10345;10230;10225;10240;10260;10217;10235;10220;10226;10227;10250;10300",
  },
  dashboard: {
    substitutionsAdminLink: "link-to-substitutions-admin-module",
  },
  preventStudentAbsenceAfterLessonStart: ["BsTest"],
};

const baseTestModuleMetadata: TestModuleMetadata = {
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    provideAnimations(),
    { provide: SETTINGS, useValue: settings },
    {
      provide: AuthService,
      useValue: {
        isAuthenticated: true,
        accessToken: "abcdefghijklmnopqrstuvwxyz",
      },
    },
  ],
};

export function buildTestModuleMetadata(
  data: TestModuleMetadata = {},
): TestModuleMetadata {
  const result: any = { ...data };
  Object.keys(baseTestModuleMetadata).forEach((key) => {
    result[key] = [
      ...(baseTestModuleMetadata as any)[key],
      ...((data && (data as any)[key]) || []),
    ];
  });
  return result;
}

export function changeInputs<
  T extends { ngOnChanges?(changes?: SimpleChanges): void },
>(
  component: T,
  changes: { property: keyof T; value: T[keyof T]; firstChange?: boolean }[],
): void {
  const simpleChanges: SimpleChanges = changes.reduce(
    (acc, { property, value, firstChange }) =>
      Object.assign(acc, {
        [property]: createInputChange(component, property, value, firstChange),
      }),
    {},
  );

  if (typeof component.ngOnChanges === "function") {
    component.ngOnChanges(simpleChanges);
  }
}

export function changeInput<
  T extends { ngOnChanges?(changes?: SimpleChanges): void },
>(
  component: T,
  property: keyof T,
  value: T[keyof T],
  firstChange = false,
): T[keyof T] {
  changeInputs(component, [{ property, value, firstChange }]);
  return value;
}

function createInputChange<
  T extends { ngOnChanges?(changes?: SimpleChanges): void },
>(
  component: T,
  property: keyof T,
  value: T[keyof T],
  firstChange = false,
): SimpleChange {
  const previousValue = component[property];
  const change = new SimpleChange(previousValue, value, firstChange);

  component[property] = value;

  return change;
}

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteMock {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params: Params): void {
    this.subject.next(convertToParamMap(params));
  }
}
