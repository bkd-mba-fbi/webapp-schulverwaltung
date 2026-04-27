import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierFilterService } from "../../../services/student-dossier-filter.service";
import { StudentStateService } from "../../../services/student-state.service";
import { StudentDossierActionsComponent } from "./student-dossier-actions.component";

describe("StudentDossierActionsComponent", () => {
  let component: StudentDossierActionsComponent;
  let fixture: ComponentFixture<StudentDossierActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierActionsComponent],
        providers: [StudentStateService, StudentDossierFilterService],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
