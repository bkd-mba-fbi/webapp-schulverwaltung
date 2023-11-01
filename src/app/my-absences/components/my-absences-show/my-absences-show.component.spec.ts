import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpTestingController } from "@angular/common/http/testing";
import { BehaviorSubject, of } from "rxjs";

import { MyAbsencesShowComponent } from "./my-absences-show.component";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyAbsencesService } from "../../services/my-absences.service";
import { MyAbsencesReportLinkComponent } from "../my-absences-report-link/my-absences-report-link.component";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildLessonAbsence } from "../../../../spec-builders";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("MyAbsencesShowComponent", () => {
  // let component: MyAbsencesShowComponent;
  let fixture: ComponentFixture<MyAbsencesShowComponent>;
  let element: HTMLElement;
  let httpTestingController: HttpTestingController;
  let openLessonAbsences$: BehaviorSubject<any>;

  beforeEach(waitForAsync(() => {
    openLessonAbsences$ = new BehaviorSubject<any>([]);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyAbsencesShowComponent, MyAbsencesReportLinkComponent],
        providers: [
          ConfirmAbsencesSelectionService,
          {
            provide: MyAbsencesService,
            useValue: {
              openLessonAbsences$,
              checkableLessonAbsences$: of([]),
              excusedLessonAbsences$: of([]),
              unexcusedLessonAbsences$: of([]),
              incidentsLessonAbsences$: of([]),
              counts$: of({}),
            },
          },
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: "42" };
              },
              getAccessToken(): Option<string> {
                return null;
              },
            },
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesShowComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe("all absences report", () => {
    it("does not render report link without absences", () => {
      fixture.detectChanges();
      expect(element.querySelector("erz-reports-link a")).toBeNull();
    });

    it("renders report link with absences", () => {
      openLessonAbsences$.next([buildLessonAbsence("12")]);
      fixture.detectChanges();

      httpTestingController
        .expectOne(
          (req) =>
            req.urlWithParams ===
            "https://eventotest.api/CrystalReports/AvailableReports/Praesenzinformation?ids=290048&keys=123_0",
        )
        .flush([{ Id: 290048, Title: "Auswertung der Absenzen" }]);
      fixture.detectChanges();

      const reportsLink = element.querySelector("erz-reports-link a");
      expect(reportsLink?.className.includes("disabled")).toBeFalse();
    });
  });
});
