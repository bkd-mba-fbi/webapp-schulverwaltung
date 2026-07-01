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
    fixture.componentRef.setInput("filter", filter);
    fixture.detectChanges();
  });

  describe("onDateFromChange", () => {
    it("updates dateFrom and dateTo to same value if empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(component.filter().dateFrom).toEqual(date);
      expect(component.filter().dateTo).toEqual(date);
    });

    it("updates dateFrom but not dateTo if not empty", () => {
      fixture.componentRef.setInput("filter", {
        ...filter,
        dateTo: new Date(),
      });
      const date = new Date(2000, 0, 23);
      component.onDateFromChange(date);
      expect(component.filter().dateFrom).toEqual(date);
      expect(component.filter().dateTo).not.toEqual(date);
    });
  });

  describe("onDateToChange", () => {
    it("updates dateFrom and dateTo to same value if empty", () => {
      const date = new Date(2000, 0, 23);
      component.onDateToChange(date);
      expect(component.filter().dateTo).toEqual(date);
      expect(component.filter().dateFrom).toEqual(date);
    });

    it("updates dateFrom but not dateTo if not empty", () => {
      fixture.componentRef.setInput("filter", {
        ...filter,
        dateFrom: new Date(),
      });
      const date = new Date(2000, 0, 23);
      component.onDateToChange(date);
      expect(component.filter().dateTo).toEqual(date);
      expect(component.filter().dateFrom).not.toEqual(date);
    });
  });
});
