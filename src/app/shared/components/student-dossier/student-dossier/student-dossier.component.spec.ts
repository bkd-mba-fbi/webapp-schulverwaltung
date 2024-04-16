import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { ReportsService } from "src/app/shared/services/reports.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DossierStateService } from "../../../services/dossier-state.service";
import { StudentDossierComponent } from "./student-dossier.component";

describe("StudentDossierComponent", () => {
  let component: StudentDossierComponent;
  let fixture: ComponentFixture<StudentDossierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierComponent],
        providers: [
          DossierStateService,
          DossierGradesService,
          ReportsService,
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj("StorageService", ["getPayload"]),
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
