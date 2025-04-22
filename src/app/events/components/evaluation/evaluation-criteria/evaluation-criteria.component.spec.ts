import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationEntry } from "src/app/events/services/evaluation-state.service";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";
import { buildGradingItem, buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationCriteriaComponent } from "./evaluation-criteria.component";

describe("EvaluationCriteriaComponent", () => {
  let component: EvaluationCriteriaComponent;
  let fixture: ComponentFixture<EvaluationCriteriaComponent>;
  let element: HTMLElement;

  let gradingItem: GradingItem;
  let detail1: SubscriptionDetail;
  let detail2: SubscriptionDetail;
  let entry: EvaluationEntry;
  let subscriptionDetailChangeCallback: jasmine.Spy;

  beforeEach(async () => {
    gradingItem = buildGradingItem(10001, 100001);
    gradingItem.IdPerson = 1001;
    gradingItem.PersonFullname = "Paul McCartney";

    detail1 = buildSubscriptionDetail(3936);
    detail1.Id = "1";
    detail1.VssDesignation = "Pünktlichkeit";
    detail1.VssStyle = "TX";
    detail1.VssTypeId = SubscriptionDetailType.ShortText;
    detail1.VssInternet = "E";
    detail1.IdPerson = gradingItem.IdPerson;
    detail1.Sort = "20";

    detail2 = buildSubscriptionDetail(3936);
    detail2.Id = "2";
    detail2.VssDesignation = "Zuverlässigkeit";
    detail2.VssTypeId = SubscriptionDetailType.ShortText;
    detail2.VssType = "Text";
    detail2.VssInternet = "E";
    detail2.IdPerson = gradingItem.IdPerson;
    detail2.Sort = "21";

    entry = {
      gradingItem,
      grade: null,
      columns: [],
      criteria: [
        { detail: detail1, value: signal("") },
        { detail: detail2, value: signal("") },
      ],
    };

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationCriteriaComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationCriteriaComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    fixture.componentRef.setInput("entry", entry);

    subscriptionDetailChangeCallback = jasmine.createSpy(
      "subscriptionDetailChange",
    );
    component.subscriptionDetailChange.subscribe(
      subscriptionDetailChangeCallback,
    );
  });

  describe("expanded", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("visible", true);
    });

    it("displays the criteria content", () => {
      fixture.detectChanges();

      expect(element.querySelector(".criteria-container")).not.toBeNull();
    });

    it("emits a change event on subscription detail input", () => {
      fixture.detectChanges();

      const input = element.querySelector<HTMLInputElement>(
        "bkd-subscription-detail-field input[type='text']",
      )!;
      input.value = "Lorem ipsum";
      input.dispatchEvent(new Event("input"));

      expect(subscriptionDetailChangeCallback).toHaveBeenCalledTimes(1);
    });

    it("hides the criteria content on toggle", () => {
      fixture.detectChanges();

      const toggle = element.querySelector<HTMLElement>(".criteria-toggle");
      toggle?.click();
      fixture.detectChanges();

      expect(component.visible()).toBe(false);
      expect(element.querySelector(".criteria-container")).toBeNull();
    });

    it("renders the criteria fields", () => {
      fixture.detectChanges();

      const fields = Array.from(
        element.querySelectorAll("bkd-subscription-detail-field"),
      );
      expect(fields).toHaveSize(2);
    });
  });

  describe("collapsed", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("visible", false);
    });

    it("does not display the criteria content", () => {
      fixture.detectChanges();

      expect(element.querySelector(".criteria-container")).toBeNull();
    });

    it("shows the criteria content on toggle", () => {
      fixture.detectChanges();

      const toggle = element.querySelector<HTMLElement>(".criteria-toggle");
      toggle?.click();
      fixture.detectChanges();

      expect(component.visible()).toBe(true);
      expect(element.querySelector(".criteria-container")).not.toBeNull();
    });
  });
});
