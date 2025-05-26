import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationGradingItemUpdateService } from "src/app/events/services/evaluation-grading-item-update.service";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { EvaluationSubscriptionDetailUpdateService } from "src/app/events/services/evaluation-subscription-detail-update.service";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade, GradingScale } from "src/app/shared/models/grading-scale.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import {
  buildGradingItem,
  buildGradingScale,
  buildSubscriptionDetail,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationListComponent } from "./evaluation-list.component";

describe("EvaluationListComponent", () => {
  let fixture: ComponentFixture<EvaluationListComponent>;
  let element: HTMLElement;
  let stateMock: jasmine.SpyObj<EvaluationStateService>;
  let gradingItemUpdateMock: jasmine.SpyObj<EvaluationGradingItemUpdateService>;
  let subscriptionDetailUpdateMock: jasmine.SpyObj<EvaluationSubscriptionDetailUpdateService>;

  let gradingItem1: GradingItem;
  let gradingItem2: GradingItem;
  let grade1: Grade;
  let grade2: Grade;
  let gradingScale: GradingScale;
  let detail1: SubscriptionDetail;
  let detail2: SubscriptionDetail;
  let detail3: SubscriptionDetail;
  let detail4: SubscriptionDetail;

  beforeEach(async () => {
    gradingItem1 = buildGradingItem(10001, 100001);
    gradingItem1.IdPerson = 1001;
    gradingItem1.PersonFullname = "Paul McCartney";

    gradingItem2 = buildGradingItem(10002, 100002);
    gradingItem2.IdPerson = 1002;
    gradingItem2.PersonFullname = "John Lennon";

    grade1 = { Id: 100001, Designation: "4.0", Value: 4.0, Sort: "10" };
    grade2 = { Id: 100002, Designation: "4.5", Value: 4.0, Sort: "11" };

    gradingScale = buildGradingScale(1, [grade1, grade2]);

    detail1 = buildSubscriptionDetail(3902);
    detail1.VssDesignation = "Anforderungen";
    detail1.Tooltip = "Art der Anforderungen";
    detail1.IdPerson = gradingItem1.IdPerson;
    detail1.Sort = "10";

    detail2 = buildSubscriptionDetail(3902);
    detail2.VssDesignation = "Anforderungen";
    detail2.Tooltip = "Art der Anforderungen";
    detail2.IdPerson = gradingItem2.IdPerson;
    detail2.Sort = "11";

    detail3 = buildSubscriptionDetail(3936);
    detail3.VssDesignation = "Pünktlichkeit";
    detail3.IdPerson = gradingItem1.IdPerson;
    detail3.Sort = "20";

    detail4 = buildSubscriptionDetail(3936);
    detail4.VssDesignation = "Pünktlichkeit";
    detail4.IdPerson = gradingItem2.IdPerson;
    detail4.Sort = "21";

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationListComponent],
        providers: [
          {
            provide: EvaluationStateService,
            useFactory() {
              stateMock = jasmine.createSpyObj("EvaluationStateService", [
                "sortCriteria",
                "loading",
                "noEvaluation",
                "event",
                "columns",
                "entries",
                "gradingScale",
              ]);

              stateMock.sortCriteria.and.returnValue({
                primarySortKey: "name",
                ascending: true,
              });

              stateMock.loading.and.returnValue(false);
              stateMock.noEvaluation.and.returnValue(false);
              stateMock.event.and.returnValue({
                id: 1000,
                designation: "Mathematik, BVS2024a",
                type: "course",
                studentCount: 24,
                gradingScaleId: 10000,
              });
              stateMock.columns.and.returnValue([
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
              ]);
              stateMock.entries.and.returnValue([
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
              ]);
              stateMock.gradingScale.and.returnValue(null);

              return stateMock;
            },
          },
          {
            provide: EvaluationGradingItemUpdateService,
            useFactory() {
              gradingItemUpdateMock =
                jasmine.createSpyObj<EvaluationGradingItemUpdateService>(
                  "EvaluationDefaultGradeUpdateService",
                  ["updateDefaultGrade", "updating"],
                );

              gradingItemUpdateMock.updating.and.returnValue(false);

              return gradingItemUpdateMock;
            },
          },
          {
            provide: EvaluationSubscriptionDetailUpdateService,
            useFactory() {
              subscriptionDetailUpdateMock = jasmine.createSpyObj(
                "EvaluationSubscriptionDetailUpdateService",
                ["updateSubscriptionDetail"],
              );
              return subscriptionDetailUpdateMock;
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationListComponent);
    element = fixture.debugElement.nativeElement;
  });

  it("renders message if event is not available", () => {
    stateMock.event.and.returnValue(null);
    fixture.detectChanges();

    expect(element.textContent).toContain("evaluation.no-event");
    expect(element.querySelector("table")).toBeNull();
  });

  it("renders message if entries are not available", () => {
    stateMock.entries.and.returnValue([]);
    fixture.detectChanges();

    expect(element.textContent).toContain("evaluation.no-items");
    expect(element.querySelector("table")).toBeNull();
  });

  it("renders message if evaluation is not possible (not grading scale and no columns)", () => {
    stateMock.columns.and.returnValue([]);
    stateMock.noEvaluation.and.returnValue(true);
    fixture.detectChanges();

    expect(element.textContent).toContain("evaluation.no-evaluation");
    expect(element.querySelector("table")).toBeNull();
  });

  it("renders evaluation table", () => {
    fixture.detectChanges();
    expect(element.querySelector("table")).not.toBeNull();
  });

  describe("default grade link", () => {
    describe("without grading scale", () => {
      it("hides default grade link when no grading scale is available", () => {
        fixture.detectChanges();
        const setDefaultLink = element.querySelector(".set-default");
        expect(setDefaultLink).toBeNull();
      });
    });

    describe("with grading scale", () => {
      beforeEach(() => {
        stateMock.gradingScale.and.returnValue(gradingScale);
      });
      it("shows default grade link when grading scale is available", () => {
        fixture.detectChanges();
        const setDefaultLink = element.querySelector(".set-default");
        expect(setDefaultLink).not.toBeNull();
      });
    });
  });

  describe("mobile column select", () => {
    describe("course with grades", () => {
      beforeEach(() => {
        stateMock.gradingScale.and.returnValue(gradingScale);
      });

      it("renders select with columns as options, including grade column, combining the absences column into one", () => {
        fixture.detectChanges();
        expect(
          element.querySelector(".columns-dropdown select"),
        ).not.toBeNull();

        const options = Array.from(
          element.querySelectorAll(".columns-dropdown select option"),
        ).map((option) => option.textContent?.trim());
        expect(options).toEqual([
          "evaluation.columns.grade",
          "Anforderungen",
          "Absenzen entschuldigt",
          "Absenzen unentschuldigt",
          "Formative Beurteilung",
        ]);
      });
    });

    describe("study class without grades", () => {
      beforeEach(() => {
        stateMock.event.and.returnValue({
          id: 2000,
          designation: "Berufsvorbereitendes Schuljahr 2024a",
          type: "study-class",
          studentCount: 23,
          gradingScaleId: null,
        });
        stateMock.gradingScale.and.returnValue(null);
      });

      it("renders select with columns as options, excluding grade column, combining the absences column into one", () => {
        fixture.detectChanges();
        expect(element.querySelector("select")).not.toBeNull();

        const options = Array.from(
          element.querySelectorAll("select option"),
        ).map((option) => option.textContent?.trim());
        expect(options).toEqual([
          "Anforderungen",
          "Absenzen entschuldigt",
          "Absenzen unentschuldigt",
          "Formative Beurteilung",
        ]);
      });
    });
  });
});
