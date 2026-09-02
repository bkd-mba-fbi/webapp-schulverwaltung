import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EditAbsencesFilter,
  EditAbsencesStateService,
} from "../../services/edit-absences-state.service";
import { EditAbsencesHeaderComponent } from "./edit-absences-header.component";

describe("EditAbsencesHeaderComponent", () => {
  let component: EditAbsencesHeaderComponent;
  let fixture: ComponentFixture<EditAbsencesHeaderComponent>;
  let filter: EditAbsencesFilter;
  let emittedFilters: ReadonlyArray<EditAbsencesFilter>;

  beforeEach(async () => {
    filter = {
      student: null,
      course: null,
      studyClass: null,
      teacher: null,
      dateFrom: null,
      dateTo: null,
      weekdays: null,
      presenceTypes: null,
      confirmationStates: null,
      incidentTypes: null,
    };

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EditAbsencesHeaderComponent],
        providers: [
          {
            provide: EditAbsencesStateService,
            useValue: {
              weekdays$: of([]),
              absenceConfirmationStates$: of([]),
              presenceTypes$: of([]),
              selected: [{ lessonIds: [1, 2, 3], personIds: [4, 5, 6] }],
              removeSelectedEntries: jasmine.createSpy("removeSelectedEntries"),
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesHeaderComponent);
    component = fixture.componentInstance;
    emittedFilters = [];
    component.filter.subscribe(
      (emitted: EditAbsencesFilter) =>
        (emittedFilters = [...emittedFilters, emitted]),
    );
    fixture.componentRef.setInput("filter", filter);
    fixture.detectChanges();
  });

  describe("onDateFromChange", () => {
    it("updates dateFrom and dateTo to same value if empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: date, dateTo: date }),
      );
    });

    it("updates dateFrom but not dateTo if not empty", () => {
      const dateTo = new Date(2000, 5, 1);
      fixture.componentRef.setInput("filter", { ...filter, dateTo });
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: date, dateTo }),
      );
    });
  });

  describe("onDateToChange", () => {
    it("updates dateFrom and dateTo to same value if empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateToChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom: date, dateTo: date }),
      );
    });

    it("updates dateFrom but not dateTo if not empty", () => {
      const dateFrom = new Date(2000, 0, 1);
      fixture.componentRef.setInput("filter", { ...filter, dateFrom });
      const date = new Date(2000, 5, 23);
      component.onDateToChange(date);
      expect(showFilter()).toEqual(
        jasmine.objectContaining({ dateFrom, dateTo: date }),
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

  function showFilter(): EditAbsencesFilter {
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
