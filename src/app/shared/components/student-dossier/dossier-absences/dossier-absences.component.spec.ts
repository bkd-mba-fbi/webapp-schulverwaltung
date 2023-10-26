import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DossierStateService } from "../../../services/dossier-state.service";
import { StudentProfileAbsencesService } from "../../../services/student-profile-absences.service";
import { StudentDossierAbsencesComponent } from "../student-dossier-absences/student-dossier-absences.component";
import { StudentDossierEntryHeaderComponent } from "../student-dossier-entry-header/student-dossier-entry-header.component";
import { DossierAbsencesComponent } from "./dossier-absences.component";

describe("DossierAbsencesComponent", () => {
  let component: DossierAbsencesComponent;
  let fixture: ComponentFixture<DossierAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          DossierAbsencesComponent,
          StudentDossierEntryHeaderComponent,
          StudentDossierAbsencesComponent,
        ],
        providers: [DossierStateService, ConfirmAbsencesSelectionService],
      }),
    )
      .overrideComponent(DossierAbsencesComponent, {
        set: {
          providers: [
            {
              provide: StudentProfileAbsencesService,
              useValue: {
                counts$: of({ checkableAbsences: null }),
                setStudentId: jasmine.createSpy("setStudentId"),
              },
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
