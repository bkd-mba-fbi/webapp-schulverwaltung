import { HttpTestingController } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { buildLessonAbsence } from "../../../../spec-builders";
import { MyAbsencesService } from "../../services/my-absences.service";
import { MyAbsencesShowComponent } from "./my-absences-show.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("MyAbsencesShowComponent", () => {
  // let component: MyAbsencesShowComponent;
  let fixture: ComponentFixture<MyAbsencesShowComponent>;
  let element: HTMLElement;
  let httpTestingController: HttpTestingController;
  let openLessonAbsences$: BehaviorSubject<any>;

  beforeEach(async () => {
    openLessonAbsences$ = new BehaviorSubject<any>([]);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyAbsencesShowComponent],
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
  });

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
      expect(element.querySelector("bkd-reports-link a")).toBeNull();
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

      const reportsLink = element.querySelector("bkd-reports-link a");
      expect(reportsLink?.className.includes("disabled")).toBeFalse();
    });
  });
});
