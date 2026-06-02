import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluateAbsencesStateService } from "../../services/evaluate-absences-state.service";
import { EvaluateAbsencesHeaderComponent } from "./evaluate-absences-header.component";

describe("EvaluateAbsencesHeaderComponent", () => {
  let component: EvaluateAbsencesHeaderComponent;
  let fixture: ComponentFixture<EvaluateAbsencesHeaderComponent>;

  beforeEach(async () => {
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
    fixture.detectChanges();
  });

  describe("onDateFromChange", () => {
    it("updates dateFrom without touching dateTo if dateTo is empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(component.filter.dateFrom).toEqual(date);
      expect(component.filter.dateTo).toBeNull();
    });

    it("updates dateFrom without touching dateTo if range remains valid", () => {
      const dateTo = new Date(2000, 5, 1);
      component.filter.dateTo = dateTo;
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(component.filter.dateFrom).toEqual(date);
      expect(component.filter.dateTo).toEqual(dateTo);
    });

    it("adjusts dateTo to dateFrom if new dateFrom is after dateTo", () => {
      component.filter.dateTo = new Date(2000, 0, 1);
      const date = new Date(2000, 5, 23);
      component.onDateFromChange(date);
      expect(component.filter.dateFrom).toEqual(date);
      expect(component.filter.dateTo).toEqual(date);
    });
  });

  describe("onDateToChange", () => {
    it("updates dateTo without touching dateFrom if dateFrom is empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateToChange(date);
      expect(component.filter.dateTo).toEqual(date);
      expect(component.filter.dateFrom).toBeNull();
    });

    it("updates dateTo without touching dateFrom if range remains valid", () => {
      const dateFrom = new Date(2000, 0, 1);
      component.filter.dateFrom = dateFrom;
      const date = new Date(2000, 5, 23);
      component.onDateToChange(date);
      expect(component.filter.dateTo).toEqual(date);
      expect(component.filter.dateFrom).toEqual(dateFrom);
    });

    it("adjusts dateFrom to dateTo if new dateTo is before dateFrom", () => {
      component.filter.dateFrom = new Date(2000, 5, 1);
      const date = new Date(2000, 0, 23);
      component.onDateToChange(date);
      expect(component.filter.dateTo).toEqual(date);
      expect(component.filter.dateFrom).toEqual(date);
    });
  });
});
