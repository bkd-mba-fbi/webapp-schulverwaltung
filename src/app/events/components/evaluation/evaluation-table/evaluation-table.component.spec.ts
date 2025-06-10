import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  EvaluationColumn,
  EvaluationEntry,
  EvaluationStateService,
} from "src/app/events/services/evaluation-state.service";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade, GradingScale } from "src/app/shared/models/grading-scale.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { buildGradingItem, buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationGradingItemUpdateService } from "../../../services/evaluation-grading-item-update.service";
import { TestStateService } from "../../../services/test-state.service";
import { EvaluationTableComponent } from "./evaluation-table.component";

describe("EvaluationTableComponent", () => {
  let fixture: ComponentFixture<EvaluationTableComponent>;
  let element: HTMLElement;

  let gradingItem1: GradingItem;
  let gradingItem2: GradingItem;
  let gradingItem3: GradingItem;
  let grade1: Grade;
  let grade2: Grade;
  let grade3: Grade;
  let detail1: SubscriptionDetail;
  let detail2: SubscriptionDetail;
  let detail3: SubscriptionDetail;
  let detail4: SubscriptionDetail;
  let columns: ReadonlyArray<EvaluationColumn>;
  let entries: ReadonlyArray<EvaluationEntry>;

  const gradingScale: GradingScale = {
    Id: 1,
    Grades: [
      {
        Id: 3001,
        Designation: "3.0",
        Value: 3.0,
        Sort: "10",
        Sufficient: false,
      },
      {
        Id: 3002,
        Designation: "4.0",
        Value: 4.0,
        Sort: "11",
        Sufficient: true,
      },
      {
        Id: 3003,
        Designation: "4.5",
        Value: 4.5,
        Sort: "12",
        Sufficient: true,
      },
    ],
    CommentsAllowed: false,
  };

  const gradingScaleWithComments: GradingScale = {
    ...gradingScale,
    CommentsAllowed: true,
  };

  beforeEach(async () => {
    gradingItem1 = buildGradingItem(2001, 3001);
    gradingItem1.IdPerson = 1001;
    gradingItem1.PersonFullname = "Paul McCartney";
    gradingItem1.Comment = "Gute Leistung";

    gradingItem2 = buildGradingItem(2002, 3002);
    gradingItem2.IdPerson = 1002;
    gradingItem2.PersonFullname = "John Lennon";
    gradingItem2.Comment = "Braucht Verbesserung";

    gradingItem3 = buildGradingItem(2003, 3003);
    gradingItem3.IdPerson = 1003;
    gradingItem3.PersonFullname = "Sean Ono Lennon";
    gradingItem3.Comment = "Motiviert";

    grade1 = {
      Id: 3001,
      Designation: "3.0",
      Value: 3.0,
      Sort: "10",
      Sufficient: false,
    };
    grade2 = {
      Id: 3002,
      Designation: "4.0",
      Value: 4.0,
      Sort: "11",
      Sufficient: true,
    };
    grade3 = {
      Id: 3003,
      Designation: "4.5",
      Value: 4.5,
      Sort: "12",
      Sufficient: true,
    };

    detail1 = buildSubscriptionDetail(3902);
    detail1.VssDesignation = "Anforderungen";
    detail1.Tooltip = "Art der Anforderungen";
    detail1.IdPerson = gradingItem1.IdPerson;
    detail1.Sort = "10";
    detail1.VssStyle = "LB";
    detail1.DropdownItems = [
      { Key: 1, Value: "EA", IsActive: true },
      { Key: 2, Value: "GE", IsActive: true },
    ];
    detail1.ShowAsRadioButtons = true;
    detail1.Value = 2;

    detail2 = buildSubscriptionDetail(3902);
    detail2.VssDesignation = "Anforderungen";
    detail2.Tooltip = "Art der Anforderungen";
    detail2.IdPerson = gradingItem2.IdPerson;
    detail2.Sort = "11";
    detail2.VssStyle = "LB";
    detail2.DropdownItems = [
      { Key: 1, Value: "EA", IsActive: true },
      { Key: 2, Value: "GE", IsActive: true },
    ];
    detail2.ShowAsRadioButtons = true;
    detail2.Value = 1;

    detail3 = buildSubscriptionDetail(3936);
    detail3.VssDesignation = "Pünktlichkeit";
    detail3.IdPerson = gradingItem1.IdPerson;
    detail3.Sort = "20";

    detail4 = buildSubscriptionDetail(3936);
    detail4.VssDesignation = "Pünktlichkeit";
    detail4.IdPerson = gradingItem2.IdPerson;
    detail4.Sort = "21";

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

    entries = [
      {
        gradingItem: gradingItem3,
        grade: grade3,
        columns: [{ detail: detail2, value: signal(detail2.Value) }],
        criteria: [{ detail: detail4, value: signal(detail4.Value) }],
        evaluationRequired: false,
      },
      {
        gradingItem: gradingItem2,
        grade: grade2,
        columns: [{ detail: detail2, value: signal(detail2.Value) }],
        criteria: [{ detail: detail4, value: signal(detail4.Value) }],
        evaluationRequired: false,
      },
      {
        gradingItem: gradingItem1,
        grade: grade1,
        columns: [{ detail: detail1, value: signal(detail1.Value) }],
        criteria: [{ detail: detail3, value: signal(detail3.Value) }],
        evaluationRequired: true,
      },
    ];

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationTableComponent],
        providers: [
          EvaluationStateService,
          EvaluationGradingItemUpdateService,
          TestStateService,
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationTableComponent);
    element = fixture.debugElement.nativeElement;

    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "name",
      ascending: true,
    });
    fixture.componentRef.setInput("columns", columns);
    fixture.componentRef.setInput("selectedColumn", null);
    fixture.componentRef.setInput("entries", entries);
    fixture.componentRef.setInput("gradingScale", gradingScale);
    fixture.componentRef.setInput("hasGradeComments", false);
  });

  describe("event with grades", () => {
    beforeEach(async () => {
      fixture.componentRef.setInput("hasGrades", true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it("renders the name column", () => {
      const values = getColumnValues(0);
      expect(values).toHaveSize(3);
      expect(values[0]).toContain("Sean Ono Lennon");
      expect(values[1]).toContain("John Lennon");
      expect(values[2]).toContain("Paul McCartney");
    });

    it("renders the grade column", () => {
      expect(getGradeColumnValues()).toEqual(["4.5", "4.0", "3.0"]);
    });

    it("renders the subscription detail columns", () => {
      expect(getColumnValues(2)).toEqual(["EA  GE", "EA  GE", "EA  GE"]);
    });

    it("renders the average of all present grades", () => {
      expect(getColumnValues(1, "table tfoot")).toEqual(["3.833"]);
    });

    it("renders required evaluations text", () => {
      const values = getColumnValues(0);
      expect(values).toHaveSize(3);
      expect(values[0]).not.toContain("evaluation.required");
      expect(values[1]).not.toContain("evaluation.required");
      expect(values[2]).toContain("evaluation.required");
    });
  });

  describe("event without grades", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("hasGrades", false);
      fixture.detectChanges();
    });

    it("renders the name column", () => {
      const values = getColumnValues(0);
      expect(values).toHaveSize(3);
      expect(values[0]).toContain("Sean Ono Lennon");
      expect(values[1]).toContain("John Lennon");
      expect(values[2]).toContain("Paul McCartney");
    });

    it("renders the subscription detail columns", () => {
      expect(getColumnValues(1)).toEqual(["EA  GE", "EA  GE", "EA  GE"]);
    });

    it("does not render the average of all present grades", () => {
      expect(getColumnValues(1, "table tfoot")).toEqual([""]);
    });
  });

  describe("event with comments allowed", () => {
    beforeEach(async () => {
      fixture.componentRef.setInput("hasGrades", true);
      fixture.componentRef.setInput("gradingScale", gradingScaleWithComments);
      fixture.componentRef.setInput("hasGradeComments", true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it("renders the comment column", () => {
      const commentTextareas = getCommentTextareas();
      expect(commentTextareas).toHaveSize(3);
    });

    it("displays the comments in the textareas", () => {
      const commentValues = getCommentValues();
      expect(commentValues).toEqual([
        "Motiviert",
        "Braucht Verbesserung",
        "Gute Leistung",
      ]);
    });
  });

  function getColumnValues(
    index: number,
    context = "table tbody",
  ): ReadonlyArray<string | undefined> {
    return Array.from(
      element.querySelectorAll(
        `${context} tr:not(.criteria) td:nth-child(${index + 1})`,
      ),
    ).map((e) => e.textContent?.trim());
  }

  function getGradeColumnValues(
    context = "table tbody",
  ): ReadonlyArray<string | undefined> {
    const gradeCells = Array.from(
      element.querySelectorAll(`${context} tr td:nth-child(2)`),
    );

    return gradeCells.map((cell) => {
      const select = cell.querySelector<HTMLSelectElement>("bkd-select select");
      return select?.selectedOptions?.item(0)?.textContent?.trim() ?? "";
    });
  }

  function getCommentTextareas(): HTMLTextAreaElement[] {
    return Array.from(
      element.querySelectorAll("bkd-grading-item-comment-textarea textarea"),
    );
  }

  function getCommentValues(): ReadonlyArray<string | undefined> {
    const textareas = getCommentTextareas();
    return Array.from(textareas).map((textarea) => textarea.value);
  }
});
