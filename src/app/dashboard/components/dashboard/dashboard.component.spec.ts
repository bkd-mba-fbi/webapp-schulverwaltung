import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StorageService } from "../../../shared/services/storage.service";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionComponent } from "../dashboard-action/dashboard-action.component";
import { DashboardActionsComponent } from "../dashboard-actions/dashboard-actions.component";
import { DashboardSearchComponent } from "../dashboard-search/dashboard-search.component";
import { DashboardTimetableComponent } from "../dashboard-timetable/dashboard-timetable.component";
import { DashboardComponent } from "./dashboard.component";

describe("DashboardComponent", () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let element: HTMLElement;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;

  beforeEach(async () => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          DashboardComponent,
          DashboardSearchComponent,
          DashboardActionsComponent,
          DashboardActionComponent,
          DashboardTimetableComponent,
        ],
        providers: [
          DashboardService,
          {
            provide: UserSettingsService,
            useValue: {
              getSetting() {
                return null;
              },
              getRolesAndPermissions() {
                return roles$;
              },
            },
          },
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: "123" };
              },
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe("without roles", () => {
    beforeEach(() => {
      roles$.next([]);
    });

    it("displays placeholder message", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("dashboard.no-access");
      expect(element.textContent).not.toContain("dashboard.search");
      expect(element.textContent).not.toContain("dashboard.actions.title");
      expect(element.textContent).not.toContain("dashboard.timetable");
    });
  });

  describe("as lesson teacher", () => {
    beforeEach(() => {
      roles$.next(["LessonTeacherRole"]);
    });

    it("displays search, actions & timetable", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain("dashboard.no-access");
      expect(element.textContent).toContain("dashboard.search");
      expect(element.textContent).toContain("dashboard.actions.title");
      expect(element.textContent).toContain("dashboard.timetable");
    });
  });

  describe("as class teacher", () => {
    beforeEach(() => {
      roles$.next(["ClassTeacherRole"]);
    });

    it("displays search", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain("dashboard.no-access");
      expect(element.textContent).toContain("dashboard.search");
      expect(element.textContent).not.toContain("dashboard.actions.title");
      expect(element.textContent).not.toContain("dashboard.timetable");
    });
  });

  describe("as student", () => {
    beforeEach(() => {
      roles$.next(["StudentRole"]);
    });

    it("displays actions & timetable", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain("dashboard.no-access");
      expect(element.textContent).not.toContain("dashboard.search");
      expect(element.textContent).toContain("dashboard.actions.title");
      expect(element.textContent).toContain("dashboard.timetable");
    });
  });

  describe("as absence administrator", () => {
    beforeEach(() => {
      roles$.next(["AbsenceAdministratorRole"]);
    });

    it("displays only search", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain("dashboard.no-access");
      expect(element.textContent).toContain("dashboard.search");
      expect(element.textContent).not.toContain("dashboard.actions.title");
      expect(element.textContent).not.toContain("dashboard.timetable");
    });
  });

  describe("as substitute administrator", () => {
    beforeEach(() => {
      roles$.next(["SubstituteAdministratorRole"]);
    });

    it("displays actions", () => {
      fixture.detectChanges();
      expect(element.textContent).not.toContain("dashboard.no-access");
      expect(element.textContent).not.toContain("dashboard.search");
      expect(element.textContent).toContain("dashboard.actions.title");
      expect(element.textContent).not.toContain("dashboard.timetable");
    });
  });
});
