import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationColumn } from "src/app/events/services/evaluation-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationTableHeaderComponent } from "./evaluation-table-header.component";

describe("EvaluationTableHeaderComponent", () => {
  let fixture: ComponentFixture<EvaluationTableHeaderComponent>;
  let element: HTMLElement;
  let columns: ReadonlyArray<EvaluationColumn>;

  beforeEach(async () => {
    columns = [
      {
        vssId: 3902,
        title: "Anforderungen",
        tooltip: null,
        sort: "10",
      },
      {
        vssId: 3710,
        title: "Absenzen entschuldigt",
        tooltip: null,
        sort: "11",
      },
      {
        vssId: 3720,
        title: "Absenzen unentschuldigt",
        tooltip: null,
        sort: "12",
      },
      {
        vssId: 3903,
        title: "Formative Beurteilung",
        tooltip: null,
        sort: "13",
      },
    ];

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationTableHeaderComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationTableHeaderComponent);
    element = fixture.debugElement.nativeElement;

    fixture.componentRef.setInput("columns", columns);
    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "name",
      ascending: true,
    });
    fixture.componentRef.setInput("selectedColumn", null);
  });

  describe("event with grades and comments", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("hasGrades", true);
      fixture.componentRef.setInput("showCommentColumn", true);
      fixture.detectChanges();
    });

    it("renders name, grade, subscription detail, and comment columns", () => {
      expect(getColumns()).toEqual([
        "evaluation.columns.name↓",
        "evaluation.columns.grade",
        "Anforderungen",
        "Absenzen entschuldigt",
        "Absenzen unentschuldigt",
        "Formative Beurteilung",
        "evaluation.columns.comment",
      ]);
    });
  });

  describe("event without grades", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("hasGrades", false);
      fixture.detectChanges();
    });

    it("renders name and subscription detail columns", () => {
      expect(getColumns()).toEqual([
        "evaluation.columns.name↓",
        "Anforderungen",
        "Absenzen entschuldigt",
        "Absenzen unentschuldigt",
        "Formative Beurteilung",
      ]);
    });
  });

  describe("event without comments", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("hasGrades", true);
      fixture.componentRef.setInput("showCommentColumn", false);
      fixture.detectChanges();
    });

    it("renders name, grade, and subscription detail columns", () => {
      expect(getColumns()).toEqual([
        "evaluation.columns.name↓",
        "evaluation.columns.grade",
        "Anforderungen",
        "Absenzen entschuldigt",
        "Absenzen unentschuldigt",
        "Formative Beurteilung",
      ]);
    });
  });

  function getColumns(): ReadonlyArray<string | undefined> {
    return Array.from(element.querySelectorAll(`th:not(.filler)`)).map((e) =>
      e.textContent?.trim(),
    );
  }
});
