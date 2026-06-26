import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { ConfigurationsService } from "src/app/shared/services/configurations.service";
import { buildLessonPresence } from "../../../../spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { CoursesRestService } from "../../../shared/services/courses-rest.service";
import { LessonPresencesRestService } from "../../../shared/services/lesson-presences-rest.service";
import { StudentsRestService } from "../../../shared/services/students-rest.service";
import { UserSettingsService } from "../../../shared/services/user-settings.service";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionsComponent } from "./dashboard-actions.component";

describe("DashboardActionsComponent", () => {
  let fixture: ComponentFixture<DashboardActionsComponent>;
  let element: HTMLElement;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;
  let canEditInstructorEmail$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DashboardActionsComponent],
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
            provide: ConfigurationsService,
            useFactory() {
              canEditInstructorEmail$ = new BehaviorSubject(true);
              return {
                canEditInstructorEmail$,
              };
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardActionsComponent);
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
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-instructor-email",
      );
    });
  });

  describe("as lesson teacher", () => {
    beforeEach(() => {
      roles$.next(["LessonTeacherRole"]);
    });

    it("displays presence control and open absences", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain(
        "dashboard.actions.presence-control",
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
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-instructor-email",
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
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-instructor-email",
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
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-instructor-email",
      );
    });
  });

  describe("as student", () => {
    beforeEach(() => {
      roles$.next(["StudentRole"]);
    });

    it("displays my absences, my absences report and edit instructor email", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain(
        "dashboard.actions.presence-control",
      );
      expect(element.textContent).not.toContain(
        "dashboard.actions.open-absences",
      );
      expect(element.textContent).not.toContain("dashboard.actions.tests");
      expect(element.textContent).toContain(
        "dashboard.actions.my-absences-report",
      );
      expect(element.textContent).toContain("dashboard.actions.my-absences");
      expect(element.textContent).not.toContain(
        "dashboard.actions.substitutions",
      );
      expect(element.textContent).toContain(
        "dashboard.actions.edit-instructor-email",
      );
    });

    it("does not display edit instructor email if cannot edit", () => {
      canEditInstructorEmail$.next(false);
      fixture.detectChanges();
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-instructor-email",
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
      expect(element.textContent).not.toContain(
        "dashboard.actions.edit-instructor-email",
      );
    });
  });
});
