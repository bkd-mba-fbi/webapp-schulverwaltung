import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { buildLessonPresenceWithIds } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { OpenAbsencesEntry } from "../../models/open-absences-entry.model";
import { OpenAbsencesService } from "../../services/open-absences.service";
import { OpenAbsencesListComponent } from "./open-absences-list.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("OpenAbsencesListComponent", () => {
  // let component: OpenAbsencesListComponent;
  let fixture: ComponentFixture<OpenAbsencesListComponent>;
  let element: HTMLElement;

  let selectionService: ConfirmAbsencesSelectionService;
  let entryA: OpenAbsencesEntry;
  let entryB: OpenAbsencesEntry;
  let storeMock: Dict<Option<string>>;

  beforeEach(async () => {
    entryA = new OpenAbsencesEntry([
      buildLessonPresenceWithIds(10, 21, 11),
      buildLessonPresenceWithIds(11, 21, 11),
    ]);
    entryB = new OpenAbsencesEntry([
      buildLessonPresenceWithIds(10, 22, 11),
      buildLessonPresenceWithIds(12, 22, 11),
    ]);

    storeMock = {};
    spyOn(localStorage, "getItem").and.callFake(
      (key: string) => storeMock[key] || null,
    );
    spyOn(localStorage, "setItem").and.callFake(
      (key: string) => storeMock[key] || null,
    );

    storeMock["CLX.LoginToken"] =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlR1dG9yaW5nIiwiY29uc3VtZXJfaWQiOiJkZXY0MjAwIiwidXNlcm5hbWUiOiJMMjQzMSIsImluc3RhbmNlX2lkIjoiR1ltVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjIxMCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsInRva2VuX2lkIjoiMzc0OSJ9.9lDju5CIIUaISRSz0x8k-kcF7Q6IhN_6HEMOlnsiDRA";

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [OpenAbsencesListComponent],
        providers: [
          ConfirmAbsencesSelectionService,
          {
            provide: OpenAbsencesService,
            useValue: {
              sortCriteria$: of({ primarySortKey: "name", ascending: true }),
              sortedEntries$: of([entryA, entryB]),
              filteredEntries$: of([entryA, entryB]),
              loading$: of(false),
            },
          },
        ],
      }),
    ).compileComponents();

    selectionService = TestBed.inject(ConfirmAbsencesSelectionService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesListComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it("renders two entries", () => {
    expect(element.querySelectorAll("div.absence-entry").length).toBe(2);
  });

  describe("selection", () => {
    it("enables edit link if an entry is selected", () => {
      const editLink = element.querySelector("a.edit") as HTMLAnchorElement;
      expect(editLink.classList.contains("disabled")).toBe(true);

      toggleCheckbox(1);
      expect(editLink.classList.contains("disabled")).toBe(false);

      toggleCheckbox(1);
      expect(editLink.classList.contains("disabled")).toBe(true);
    });

    it("updates selected ids", () => {
      expectSelection([]);

      toggleCheckbox(1);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
      ]);

      toggleCheckbox(2);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
        { personId: 22, presenceTypeId: 11, lessonIds: [10, 12] },
      ]);

      toggleCheckbox(1);
      toggleCheckbox(2);
      expectSelection([]);
    });

    it("toggle all checkboxes on checkbox header click", () => {
      expectSelection([]);
      toggleHeaderCheckbox();
      expect(element.querySelectorAll("div.absence-entry").length).toBe(2);
    });

    function toggleHeaderCheckbox(): void {
      (
        element.querySelector(
          '.absence-header input[type="checkbox"]',
        ) as HTMLInputElement
      ).click();
      fixture.detectChanges();
    }

    function toggleCheckbox(index: number): void {
      (
        element.querySelectorAll('input[type="checkbox"]')[
          index
        ] as HTMLInputElement
      ).click();
      fixture.detectChanges();
    }

    function expectSelection(expected: any): void {
      selectionService.selectedIds$
        .pipe(take(1))
        .subscribe((selection) => expect(selection).toEqual(expected));
    }
  });
});
