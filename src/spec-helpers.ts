import { SimpleChanges, SimpleChange } from "@angular/core";
import { TestModuleMetadata } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ParamMap, Params, convertToParamMap } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ReplaySubject } from "rxjs";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { SharedModule } from "./app/shared/shared.module";
import { Settings, SETTINGS } from "./app/settings";
import { AuthService } from "./app/shared/services/auth.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

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
  personMasterDataReportId: 290026,
  studentConfirmationReportId: 290036,
  evaluateAbsencesReportId: 290048,
  testsByCourseReportId: 290044,
  testsBySubscriptionReportIdStudent: 290042,
  testsBySubscriptionReportIdTeacher: 290041,
  subscriptionDetailGroupId: 3843,
  headerRoleRestriction: {
    myAbsences: "StudentRole",
    presenceControl: "LessonTeacherRole",
    openAbsences: "LessonTeacherRole;ClassTeacherRole",
    editAbsences: "LessonTeacherRole;ClassTeacherRole",
  },
  notificationRefreshTime: 30,
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
    eventdetail: "link-to-event-detail-module/:id",
    evaluation: "link-to-evaluation-module/:id",
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
    RouterTestingModule,
    HttpClientTestingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
  ],
  providers: [
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
