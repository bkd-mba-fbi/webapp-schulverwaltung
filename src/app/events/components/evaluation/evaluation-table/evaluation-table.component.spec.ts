import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  EvaluationColumn,
  EvaluationEntry,
} from "src/app/events/services/evaluation-state.service";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade } from "src/app/shared/models/grading-scale.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { buildGradingItem, buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationTableComponent } from "./evaluation-table.component";

describe("EvaluationTableComponent", () => {
  let fixture: ComponentFixture<EvaluationTableComponent>;
  let element: HTMLElement;

  let gradingItem1: GradingItem;
  let gradingItem2: GradingItem;
  let grade1: Grade;
  let grade2: Grade;
  let detail1: SubscriptionDetail;
  let detail2: SubscriptionDetail;
  let detail3: SubscriptionDetail;
  let detail4: SubscriptionDetail;
  let columns: ReadonlyArray<EvaluationColumn>;
  let entries: ReadonlyArray<EvaluationEntry>;

  beforeEach(async () => {
    gradingItem1 = buildGradingItem(10001, 100001);
    gradingItem1.IdPerson = 1001;
    gradingItem1.PersonFullname = "Paul McCartney";

    gradingItem2 = buildGradingItem(10002, 100002);
    gradingItem2.IdPerson = 1002;
    gradingItem2.PersonFullname = "John Lennon";

    grade1 = { Id: 100001, Designation: "4.0", Value: 4.0, Sort: "10" };
    grade2 = { Id: 100002, Designation: "4.5", Value: 4.0, Sort: "11" };

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
        gradingItem: gradingItem2,
        grade: grade2,
        columns: [{ detail: detail2, value: signal(detail2.Value) }],
        criteria: [{ detail: detail4, value: signal(detail4.Value) }],
      },
      {
        gradingItem: gradingItem1,
        grade: grade1,
        columns: [{ detail: detail1, value: signal(detail1.Value) }],
        criteria: [{ detail: detail3, value: signal(detail3.Value) }],
      },
    ];

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationTableComponent],
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
  });

  describe("event with grades", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("hasGrades", true);
      fixture.detectChanges();
    });

    it("renders the name column", () => {
      const values = getColumnValues(0);
      expect(values).toHaveSize(2);
      expect(values[0]).toContain("John Lennon");
      expect(values[1]).toContain("Paul McCartney");
    });

    it("renders the grade column", () => {
      expect(getColumnValues(1)).toEqual(["4.5", "4.0"]);
    });

    it("renders the subscription detail columns", () => {
      expect(getColumnValues(2)).toEqual(["EA  GE", "EA  GE"]);
    });

    it("renders the average of all present grades", () => {
      expect(getColumnValues(1, "table tfoot")).toEqual(["4.0"]);
    });
  });

  describe("event without grades", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("hasGrades", false);
      fixture.detectChanges();
    });

    it("renders the name column", () => {
      const values = getColumnValues(0);
      expect(values).toHaveSize(2);
      expect(values[0]).toContain("John Lennon");
      expect(values[1]).toContain("Paul McCartney");
    });

    it("renders the subscription detail columns", () => {
      expect(getColumnValues(1)).toEqual(["EA  GE", "EA  GE"]);
    });

    it("does not render the average of all present grades", () => {
      expect(getColumnValues(1, "table tfoot")).toEqual([""]);
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
});
