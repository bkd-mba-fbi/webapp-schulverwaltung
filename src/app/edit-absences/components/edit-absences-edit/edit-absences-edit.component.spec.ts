import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpTestingController } from "@angular/common/http/testing";
import { of, Observable } from "rxjs";
import { isEqual } from "lodash-es";

import { buildTestModuleMetadata, settings } from "src/spec-helpers";
import { EditAbsencesEditComponent } from "./edit-absences-edit.component";
import { EditAbsencesStateService } from "../../services/edit-absences-state.service";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { buildPresenceType, buildLessonPresence } from "src/spec-builders";
import { DropDownItemsRestService } from "src/app/shared/services/drop-down-items-rest.service";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("EditAbsencesEditComponent", () => {
  let component: EditAbsencesEditComponent;
  let fixture: ComponentFixture<EditAbsencesEditComponent>;
  let element: HTMLElement;
  let httpTestingController: HttpTestingController;
  let state: EditAbsencesStateService;
  let absence: PresenceType;
  let doctor: PresenceType;
  let ill: PresenceType;
  let late: PresenceType;
  let dispensation: PresenceType;
  let halfDay: PresenceType;

  beforeEach(waitForAsync(() => {
    absence = buildPresenceType(settings.absencePresenceTypeId, true, false);
    absence.NeedsConfirmation = true;

    doctor = buildPresenceType(13, true, false);
    doctor.NeedsConfirmation = true;
    doctor.Designation = "Arzt";

    ill = buildPresenceType(14, true, false);
    ill.NeedsConfirmation = true;
    ill.Designation = "Krank";

    late = buildPresenceType(settings.latePresenceTypeId, false, true);
    late.Designation = "Verspätung";

    dispensation = buildPresenceType(
      settings.dispensationPresenceTypeId,
      false,
      false,
    );
    dispensation.IsDispensation = true;

    halfDay = buildPresenceType(settings.halfDayPresenceTypeId, false, false);
    halfDay.IsHalfDay = true;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EditAbsencesEditComponent],
        providers: [
          {
            provide: EditAbsencesStateService,
            useValue: {
              presenceTypes$: of([]),
              selected: [],
              resetSelection: jasmine.createSpy("resetSelection"),
            },
          },
          {
            provide: PresenceTypesService,
            useValue: {
              presenceTypes$: of([
                absence,
                doctor,
                ill,
                late,
                dispensation,
                halfDay,
              ]),
              confirmationTypes$: of([absence, doctor, ill]),
              incidentTypes$: of([late]),
              halfDayActive$: of(true),
            },
          },
          {
            provide: DropDownItemsRestService,
            useValue: {
              getAbsenceConfirmationStates(): Observable<
                ReadonlyArray<DropDownItem>
              > {
                return of([
                  {
                    Key: settings.excusedAbsenceStateId,
                    Value: "entschuldigt",
                  },
                  {
                    Key: settings.unexcusedAbsenceStateId,
                    Value: "unentschuldigt",
                  },
                  {
                    Key: settings.unconfirmedAbsenceStateId,
                    Value: "zu bestätigen",
                  },
                  {
                    Key: settings.checkableAbsenceStateId,
                    Value: "zu kontrollieren",
                  },
                ]);
              },
            },
          },
        ],
      }),
    ).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    state = TestBed.inject(EditAbsencesStateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesEditComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    // Don't do any navigation
    (component as any).onSaveSuccess = jasmine.createSpy("onSaveSuccess");
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe("initial absence type", () => {
    it("preselects the absence type if all selected entries have the same", () => {
      state.selected = [
        buildLessonPresence(
          1,
          new Date(),
          new Date(),
          "Math",
          undefined,
          undefined,
          ill.Id,
        ),
        buildLessonPresence(
          2,
          new Date(),
          new Date(),
          "Deutsch",
          undefined,
          undefined,
          ill.Id,
        ),
      ];
      fixture.detectChanges();
      expect(getSelect("absenceTypeId").value).toContain(String(ill.Id));
    });

    it("is empty if absence type of selected entries differs", () => {
      state.selected = [
        buildLessonPresence(
          1,
          new Date(),
          new Date(),
          "Math",
          undefined,
          undefined,
          doctor.Id,
        ),
        buildLessonPresence(
          2,
          new Date(),
          new Date(),
          "Deutsch",
          undefined,
          undefined,
          ill.Id,
        ),
      ];
      fixture.detectChanges();

      expect(getSelect("absenceTypeId").value).toContain("null");
    });
  });

  describe("form submission", () => {
    beforeEach(() => {
      state.selected = [
        buildLessonPresence(
          1,
          new Date(),
          new Date(),
          "Math",
          undefined,
          undefined,
          undefined,
          undefined,
          100,
        ),
        buildLessonPresence(
          2,
          new Date(),
          new Date(),
          "Französisch",
          undefined,
          undefined,
          absence.Id,
          undefined,
          100,
        ),
        buildLessonPresence(
          3,
          new Date(),
          new Date(),
          "Math",
          undefined,
          undefined,
          doctor.Id,
          undefined,
          100,
        ),
        buildLessonPresence(
          4,
          new Date(),
          new Date(),
          "Englisch",
          undefined,
          undefined,
          ill.Id,
          undefined,
          100,
        ),
        buildLessonPresence(
          5,
          new Date(),
          new Date(),
          "Chemie",
          undefined,
          undefined,
          late.Id,
          undefined,
          100,
        ),
        buildLessonPresence(
          6,
          new Date(),
          new Date(),
          "Zeichnen",
          undefined,
          undefined,
          dispensation.Id,
          undefined,
          100,
        ),
        buildLessonPresence(
          7,
          new Date(),
          new Date(),
          "Turnen",
          undefined,
          undefined,
          halfDay.Id,
          undefined,
          100,
        ),
      ];
      fixture.detectChanges();
    });

    it("resets all entries if updating to present", () => {
      clickRadio("present");
      clickSave();

      expectResetRequest({
        LessonIds: [1, 2, 3, 4, 5, 6, 7],
        PersonIds: [100],
        WithComment: true,
      });

      expect().nothing();
    });

    it("updates all entries to chosen absence type if excused", () => {
      clickRadio("entschuldigt");
      selectOption("absenceTypeId", "Krank");
      clickSave();

      expectEditRequest({
        LessonIds: [1, 2, 3, 4, 5, 6, 7],
        PersonIds: [100],
        PresenceTypeId: ill.Id,
        ConfirmationValue: settings.excusedAbsenceStateId,
      });

      expect().nothing();
    });

    it("updates all entries to default absence type if unexcused", () => {
      clickRadio("unentschuldigt");
      clickSave();

      expectEditRequest({
        LessonIds: [1, 2, 3, 4, 5, 6, 7],
        PersonIds: [100],
        PresenceTypeId: settings.absencePresenceTypeId,
        ConfirmationValue: settings.unexcusedAbsenceStateId,
      });

      expect().nothing();
    });

    it("marks all entries as unconfirmed but preserves absence type if available", () => {
      clickRadio("zu bestätigen");
      clickSave();

      expectEditRequest({
        LessonIds: [1, 5, 6, 7],
        PersonIds: [100],
        PresenceTypeId: absence.Id,
        ConfirmationValue: settings.unconfirmedAbsenceStateId,
      });
      expectEditRequest({
        LessonIds: [2, 3, 4],
        PersonIds: [100],
        ConfirmationValue: settings.unconfirmedAbsenceStateId,
      });

      expect().nothing();
    });

    it("marks all entries as checkable but preserves absence type if available", () => {
      clickRadio("zu kontrollieren");
      clickSave();

      expectEditRequest({
        LessonIds: [1, 5, 6, 7],
        PersonIds: [100],
        PresenceTypeId: absence.Id,
        ConfirmationValue: settings.checkableAbsenceStateId,
      });
      expectEditRequest({
        LessonIds: [2, 3, 4],
        PersonIds: [100],
        ConfirmationValue: settings.checkableAbsenceStateId,
      });

      expect().nothing();
    });

    it("updates entries to dispensation", () => {
      clickRadio("dispensation");
      clickSave();

      expectEditRequest({
        LessonIds: [1, 2, 3, 4, 5, 6, 7],
        PersonIds: [100],
        PresenceTypeId: settings.dispensationPresenceTypeId,
      });

      expect().nothing();
    });

    it("updates entries to half day", () => {
      clickRadio("half-day");
      clickSave();

      expectEditRequest({
        LessonIds: [1, 2, 3, 4, 5, 6, 7],
        PersonIds: [100],
        PresenceTypeId: settings.halfDayPresenceTypeId,
      });

      expect().nothing();
    });

    it("updates entries to incident", () => {
      clickRadio("incident");
      selectOption("incidentId", "Verspätung");
      clickSave();

      expectEditRequest({
        LessonIds: [1, 2, 3, 4, 5, 6, 7],
        PersonIds: [100],
        PresenceTypeId: settings.latePresenceTypeId,
      });
      expect().nothing();
    });
  });

  function getSelect(controlName: string): HTMLSelectElement {
    const select = element.querySelector(
      `select[formControlName="${controlName}"]`,
    ) as HTMLSelectElement | undefined;
    expect(select).toBeDefined();
    return select as HTMLSelectElement;
  }

  function selectOption(controlName: string, optionLabel: string): void {
    const select = getSelect(controlName);
    const option = Array.prototype.slice
      .call(select.options)
      .find((o) => o.label === optionLabel);
    select.value = option?.value;
    select.dispatchEvent(new Event("change"));
  }

  function clickRadio(labelText: string): void {
    const labels = Array.prototype.slice.call(
      element.querySelectorAll("label"),
    );
    const label = labels.find((l) => l.textContent.includes(labelText)) as
      | HTMLElement
      | undefined;
    return label?.parentElement?.querySelector("input")?.click();
  }

  function clickSave(): void {
    const button = element.querySelector('button[type="submit"]') as
      | HTMLButtonElement
      | undefined;
    button?.click();
  }

  function expectResetRequest(body: any): void {
    const url = "https://eventotest.api/LessonPresences/Reset";

    httpTestingController
      .expectOne(
        (req) => req.urlWithParams === url && isEqual(req.body, body),
        url,
      )
      .flush("");
  }

  function expectEditRequest(body: any): void {
    const url = "https://eventotest.api/LessonPresences/Edit";

    httpTestingController
      .expectOne(
        (req) => req.urlWithParams === url && isEqual(req.body, body),
        url,
      )
      .flush("");
  }
});
