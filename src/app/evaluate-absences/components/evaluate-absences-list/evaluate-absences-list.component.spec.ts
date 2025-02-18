import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { LessonPresenceStatistic } from "src/app/shared/models/lesson-presence-statistic";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { buildLessonPresenceStatistic } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StorageService } from "../../../shared/services/storage.service";
import { EvaluateAbsencesStateService } from "../../services/evaluate-absences-state.service";
import { EvaluateAbsencesListComponent } from "./evaluate-absences-list.component";

describe("EvaluateAbsencesListComponent", () => {
  let fixture: ComponentFixture<EvaluateAbsencesListComponent>;
  // let component: EvaluateAbsencesListComponent;
  let element: HTMLElement;
  let stateServiceMock: EvaluateAbsencesStateService;
  let presenceTypesServiceMock: PresenceTypesService;
  let statistic: LessonPresenceStatistic;

  beforeEach(async () => {
    statistic = buildLessonPresenceStatistic(333);

    stateServiceMock = {
      setFilter: jasmine.createSpy("setFilter"),
      isFilterValid$: of(true),
      validFilter$: of({
        student: null,
        educationalEvent: null,
        studyClass: 5976,
      }),
      entries$: of([statistic]),
      sortCriteria$: of({ key: "StudentFullName", ascending: true }),
      loading$: of(false),
    } as unknown as EvaluateAbsencesStateService;

    presenceTypesServiceMock = {
      halfDayActive$: of(false),
    } as unknown as PresenceTypesService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluateAbsencesListComponent],
        providers: [
          {
            provide: EvaluateAbsencesStateService,
            useValue: stateServiceMock,
          },
          { provide: PresenceTypesService, useValue: presenceTypesServiceMock },
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: "42" };
              },
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesListComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe("without half days", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("displays the results in a table", () => {
      const table = element.querySelector("table");
      expect(table).toBeDefined();

      const headerCells = table!.querySelectorAll("th");
      expect(Array.from(headerCells)).toHaveSize(7);
      expect(headerCells[6].textContent).toContain(
        "evaluate-absences.list.header.incident",
      );

      const rows = table!.querySelectorAll("tbody tr");
      expect(Array.from(rows)).toHaveSize(1);

      const bodyCells = rows[0].querySelectorAll("td");
      expect(Array.from(bodyCells)).toHaveSize(7);
      expect(bodyCells[0].textContent).toContain("Bachofner Roman");
      expect(bodyCells[6].textContent).toContain("0");
    });
  });

  describe("with half days", () => {
    beforeEach(() => {
      presenceTypesServiceMock.halfDayActive$ = of(true);
      fixture.detectChanges();
    });

    it("displays the results in a table", () => {
      const table = element.querySelector("table");
      expect(table).toBeDefined();

      const headerCells = table!.querySelectorAll("th");
      expect(Array.from(headerCells)).toHaveSize(8);
      expect(headerCells[6].textContent).toContain(
        "evaluate-absences.list.header.incident",
      );
      expect(headerCells[7].textContent).toContain(
        "evaluate-absences.list.header.halfday",
      );

      const rows = table!.querySelectorAll("tbody tr");
      expect(Array.from(rows)).toHaveSize(1);

      const bodyCells = rows[0].querySelectorAll("td");
      expect(Array.from(bodyCells)).toHaveSize(8);
      expect(bodyCells[0].textContent).toContain("Bachofner Roman");
      expect(bodyCells[6].textContent).toContain("0");
      expect(bodyCells[7].textContent).toContain("0");
    });
  });
});
