import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import {
  DossierPage,
  DossierStateService,
} from "src/app/shared/services/dossier-state.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";

import { DossierGradesComponent } from "./dossier-grades.component";
import { BehaviorSubject, of } from "rxjs";
import { Course } from "../../../models/course.model";
import { buildCourse, buildGradingScale } from "../../../../../spec-builders";
import { GradingScale } from "../../../models/grading-scale.model";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("DossierGradesComponent", () => {
  let component: DossierGradesComponent;
  let fixture: ComponentFixture<DossierGradesComponent>;

  let dossierStateServiceMock: DossierStateService;
  let currentDossier$: BehaviorSubject<DossierPage>;

  let dossierGradesServiceMock: DossierGradesService;
  let loading$: BehaviorSubject<boolean>;
  let studentCourses$: BehaviorSubject<Course[]>;
  let gradingScales$: BehaviorSubject<readonly GradingScale[]>;

  const courses = [buildCourse(1234)];
  const gradingScales = [buildGradingScale(1)];

  beforeEach(async () => {
    currentDossier$ = new BehaviorSubject<DossierPage>("grades");

    dossierStateServiceMock = {
      currentDossier$,
      studentId$: of(123),
    } as unknown as DossierStateService;

    loading$ = new BehaviorSubject<any>(false);
    studentCourses$ = new BehaviorSubject<Course[]>(courses);
    gradingScales$ = new BehaviorSubject<readonly GradingScale[]>(
      gradingScales,
    );

    dossierGradesServiceMock = {
      loading$,
      studentCourses$,
      gradingScales$,
    } as unknown as DossierGradesService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesComponent],
        providers: [
          { provide: DossierStateService, useValue: dossierStateServiceMock },
          {
            provide: DossierGradesService,
            useValue: {
              dossierGradesServiceMock,
              setStudentId: jasmine.createSpy("setStudentId"),
            },
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
