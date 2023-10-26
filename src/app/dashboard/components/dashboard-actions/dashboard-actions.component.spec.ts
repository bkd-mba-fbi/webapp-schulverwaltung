import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardActionsComponent } from "./dashboard-actions.component";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { UserSettingsService } from "../../../shared/services/user-settings.service";
import { BehaviorSubject, of } from "rxjs";
import { LessonPresencesRestService } from "../../../shared/services/lesson-presences-rest.service";
import { StudentsRestService } from "../../../shared/services/students-rest.service";
import { StorageService } from "../../../shared/services/storage.service";
import { buildLessonPresence, buildPerson } from "../../../../spec-builders";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionComponent } from "../dashboard-action/dashboard-action.component";
import { DashboardDeadlineComponent } from "../dashboard-deadline/dashboard-deadline.component";
import { CoursesRestService } from "../../../shared/services/courses-rest.service";
import { PersonsRestService } from "../../../shared/services/persons-rest.service";

describe("DashboardActionsComponent", () => {
  // let component: DashboardActionsComponent;
  let fixture: ComponentFixture<DashboardActionsComponent>;
  let element: HTMLElement;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;

  beforeEach(async () => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          DashboardActionsComponent,
          DashboardActionComponent,
          DashboardDeadlineComponent,
        ],
        providers: [
          DashboardService,
          {
            provide: UserSettingsService,
            useValue: {
              getRolesAndPermissions() {
                return roles$;
              },
            },
          },
          {
            provide: LessonPresencesRestService,
            useValue: {
              hasLessonsLessonTeacher() {
                return of(true);
              },
              checkableAbsencesCount() {
                return of(0);
              },
              getListOfUnconfirmed() {
                return of([
                  buildLessonPresence(1, new Date(), new Date(), "Math"),
                ]);
              },
            },
          },
          {
            provide: StudentsRestService,
            useValue: {
              getLessonAbsences() {
                return of([]);
              },
              getLessonIncidents() {
                return of([]);
              },
              getTimetableEntries() {
                return of([]);
              },
            },
          },
          {
            provide: CoursesRestService,
            useValue: {
              getNumberOfCoursesForRating() {
                return of(123);
              },
            },
          },
          {
            provide: PersonsRestService,
            useValue: {
              getMyself() {
                return of(buildPerson(3));
              },
            },
          },
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: "123", fullName: "Stolz Zuzana" };
              },
              getListOfUnconfirmed() {
                return of([
                  buildLessonPresence(1, new Date(), new Date(), "Math"),
                ]);
              },
              getLanguage() {
                return "de-CH";
              },
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardActionsComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe("without roles", () => {
    beforeEach(() => {
      roles$.next([]);
    });

    it("displays no actions", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain(
        "dashboard.actions.presence-control",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.open-absences",
      );
      expect(element.textContent).not.toContain("dashboard.actions.tests");
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences-report",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.substitutions",
      );
    });
  });

  describe("as lesson teacher", () => {
    beforeEach(() => {
      roles$.next(["LessonTeacherRole"]);
    });

    it("displays presence control, edit and open absences", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain(
        "dashboard.actions.presence-control",
      );
      expect(element.textContent).toContain("dashboard.actions.edit-absences0");
      expect(element.textContent).toContain("dashboard.actions.open-absences1");
      expect(element.textContent).not.toContain("dashboard.actions.tests");
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences-report",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.substitutions",
      );
    });
  });

  describe("as class teacher", () => {
    beforeEach(() => {
      roles$.next(["ClassTeacherRole"]);
    });

    it("displays open absences", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain(
        "dashboard.actions.presence-control",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-absences",
      );
      expect(element.textContent).toContain("dashboard.actions.open-absences1");
      expect(element.textContent).not.toContain("dashboard.actions.tests");
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences-report",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.substitutions",
      );
    });
  });

  describe("as teacher", () => {
    beforeEach(() => {
      roles$.next(["TeacherRole"]);
    });

    it("displays tests", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain(
        "dashboard.actions.presence-control",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.open-absences",
      );
      expect(element.textContent).toContain("dashboard.actions.tests");
      expect(element.textContent).toContain("dashboard.actions.deadline: 123");
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences-report",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.substitutions",
      );
    });
  });

  describe("as student", () => {
    beforeEach(() => {
      roles$.next(["StudentRole"]);
    });

    it("displays my absences, my absences report", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain(
        "dashboard.actions.presence-control",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.open-absences",
      );
      expect(element.textContent).not.toContain("dashboard.actions.tests");
      expect(element.textContent).toContain(
        "dashboard.actions.my-absences-report",
      );
      expect(element.textContent).toContain("dashboard.actions.my-absences0");
      expect(element.textContent).not.toContain(
        "dashboard.actions.substitutions",
      );
    });
  });

  describe("as substitution admin", () => {
    beforeEach(() => {
      roles$.next(["SubstituteAdministratorRole"]);
    });

    it("displays substitutions", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain(
        "dashboard.actions.presence-control",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-absences",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.open-absences",
      );
      expect(element.textContent).not.toContain("dashboard.actions.tests");
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences-report",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.my-absences",
      );
      expect(element.textContent).toContain("dashboard.actions.substitutions");
    });
  });
});
