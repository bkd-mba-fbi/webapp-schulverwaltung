import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EvaluateAbsencesFilter,
  EvaluateAbsencesStateService,
} from "../../services/evaluate-absences-state.service";
import { EvaluateAbsencesHeaderComponent } from "./evaluate-absences-header.component";

describe("EvaluateAbsencesHeaderComponent", () => {
  let component: EvaluateAbsencesHeaderComponent;
  let fixture: ComponentFixture<EvaluateAbsencesHeaderComponent>;
  let filter: EvaluateAbsencesFilter;
  let emittedFilters: ReadonlyArray<EvaluateAbsencesFilter>;

  beforeEach(async () => {
    filter = {
      student: null,
      course: null,
      studyClass: null,
      dateFrom: null,
      dateTo: null,
    };

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluateAbsencesHeaderComponent],
        providers: [EvaluateAbsencesStateService],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesHeaderComponent);
    component = fixture.componentInstance;
    emittedFilters = [];
    component.filter.subscribe(
      (emitted: EvaluateAbsencesFilter) =>
        (emittedFilters = [...emittedFilters, emitted]),
    );
    fixture.componentRef.setInput("filter", filter);
    fixture.detectChanges();
  });

  describe("onDateFromChange", () => {
    it("updates dateFrom without touching dateTo if dateTo is empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: date, dateTo: null }),
      );
    });

    it("updates dateFrom without touching dateTo if range remains valid", () => {
      const dateTo = new Date(2000, 5, 1);
      fixture.componentRef.setInput("filter", { ...filter, dateTo });
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: date, dateTo }),
      );
    });

    it("adjusts dateTo to dateFrom if new dateFrom is after dateTo", () => {
      fixture.componentRef.setInput("filter", {
        ...filter,
        dateTo: new Date(2000, 0, 1),
      });
      const date = new Date(2000, 5, 23);
      component.onDateFromChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: date, dateTo: date }),
      );
    });
  });

  describe("onDateToChange", () => {
    it("updates dateTo without touching dateFrom if dateFrom is empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateToChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: null, dateTo: date }),
      );
    });

    it("updates dateTo without touching dateFrom if range remains valid", () => {
      const dateFrom = new Date(2000, 0, 1);
      fixture.componentRef.setInput("filter", { ...filter, dateFrom });
      const date = new Date(2000, 5, 23);
      component.onDateToChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom, dateTo: date }),
      );
    });

    it("adjusts dateFrom to dateTo if new dateTo is before dateFrom", () => {
      fixture.componentRef.setInput("filter", {
        ...filter,
        dateFrom: new Date(2000, 5, 1),
      });
      const date = new Date(2000, 0, 23);
      component.onDateToChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: date, dateTo: date }),
      );
    });
  });

  it("does not emit the filter before the show button is clicked", () => {
    component.onDateFromChange(new Date(2000, 0, 23, 14, 35));
    expect(emittedFilters).toEqual([]);
  });

  it("normalizes the dates when emitting the filter", () => {
    component.onDateFromChange(new Date(2000, 0, 23, 14, 35));
    component.onDateToChange(new Date(2000, 5, 1, 9, 15));
    expect(showFilter()).toEqual(
      jasmine.objectContaining({
        dateFrom: new Date(2000, 0, 23),
        dateTo: new Date(2000, 5, 1),
      }),
    );
  });

  function showFilter(): EvaluateAbsencesFilter {
    getShowButton().click();
    return emittedFilters[emittedFilters.length - 1];
  }

  function getShowButton(): HTMLButtonElement {
    const showButton =
      fixture.debugElement.nativeElement.querySelector("button.btn-primary");
    expect(showButton).not.toBeNull();
    return showButton!;
  }
});
