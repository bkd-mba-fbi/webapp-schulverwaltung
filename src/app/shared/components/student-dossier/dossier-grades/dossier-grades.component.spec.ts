import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import {
  DossierPage,
  DossierStateService,
} from "src/app/shared/services/dossier-state.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { buildCourse, buildGradingScale } from "../../../../../spec-builders";
import { DossierGradesComponent } from "./dossier-grades.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("DossierGradesComponent", () => {
  let component: DossierGradesComponent;
  let fixture: ComponentFixture<DossierGradesComponent>;

  let dossierStateServiceMock: DossierStateService;
  let currentDossier$: BehaviorSubject<DossierPage>;

  let dossierGradesServiceMock: DossierGradesService;

  beforeEach(async () => {
    currentDossier$ = new BehaviorSubject<DossierPage>("grades");

    dossierStateServiceMock = {
      currentDossier$,
      studentId$: of(123),
    } as unknown as DossierStateService;

    dossierGradesServiceMock = {
      loading$: of(false),
      studentCourses$: of([buildCourse(1234)]),
      gradingScales$: of([buildGradingScale(1)]),
      setStudentId: jasmine.createSpy("setStudentId"),
      getFinalGradeForStudent: jasmine.createSpy("getFinalGradeForStudent"),
      getGradesForStudent: jasmine
        .createSpy("getGradesForStudent")
        .and.returnValue([]),
      getGradingForStudent: jasmine.createSpy("getGradingForStudent"),
      getGradingScaleOfCourse: jasmine.createSpy("getGradingScaleOfCourse"),
    } as unknown as DossierGradesService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DossierGradesComponent],
        providers: [
          { provide: DossierStateService, useValue: dossierStateServiceMock },
          {
            provide: DossierGradesService,
            useValue: dossierGradesServiceMock,
          },
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj("StorageService", ["getPayload"]),
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
