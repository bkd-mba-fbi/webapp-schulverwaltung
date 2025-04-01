import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade } from "src/app/shared/models/grading-scale.model";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { buildGradingItem, buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationListComponent } from "./evaluation-list.component";

describe("EvaluationListComponent", () => {
  let fixture: ComponentFixture<EvaluationListComponent>;
  let element: HTMLElement;
  let stateMock: jasmine.SpyObj<EvaluationStateService>;

  let gradingItem1: GradingItem;
  let gradingItem2: GradingItem;
  let grade1: Grade;
  let grade2: Grade;
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
                  columns: [detail2],
                  criteria: [detail4],
                },
                {
                  gradingItem: gradingItem1,
                  grade: grade1,
                  columns: [detail1],
                  criteria: [detail3],
                },
              ]);

              return stateMock;
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

  describe("mobile column select", () => {
    describe("course", () => {
      it("renders select with columns as options, including grade column, combining the absences column into one", () => {
        fixture.detectChanges();
        expect(element.querySelector("select")).not.toBeNull();

        const options = Array.from(
          element.querySelectorAll("select option"),
        ).map((option) => option.textContent?.trim());
        expect(options).toEqual([
          "evaluation.columns.grade",
          "Anforderungen",
          "evaluation.columns.absences",
          "Formative Beurteilung",
        ]);
      });
    });

    describe("study class", () => {
      beforeEach(() => {
        stateMock.event.and.returnValue({
          id: 2000,
          designation: "Berufsvorbereitendes Schuljahr 2024a",
          type: "study-class",
          studentCount: 23,
          gradingScaleId: null,
        });
      });

      it("renders select with columns as options, excluding grade column, combining the absences column into one", () => {
        fixture.detectChanges();
        expect(element.querySelector("select")).not.toBeNull();

        const options = Array.from(
          element.querySelectorAll("select option"),
        ).map((option) => option.textContent?.trim());
        expect(options).toEqual([
          "Anforderungen",
          "evaluation.columns.absences",
          "Formative Beurteilung",
        ]);
      });
    });
  });
});
