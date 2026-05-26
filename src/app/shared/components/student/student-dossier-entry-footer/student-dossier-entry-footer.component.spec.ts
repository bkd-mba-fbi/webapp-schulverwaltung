import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { buildAdditionalInformation, buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEntryFooterComponent } from "./student-dossier-entry-footer.component";

describe("StudentDossierEntryFooterComponent", () => {
  let component: StudentDossierEntryFooterComponent;
  let fixture: ComponentFixture<StudentDossierEntryFooterComponent>;
  let entry: StudentDossierEntry;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEntryFooterComponent],
        providers: [
          {
            provide: StudentStateService,
            useValue: {
              studentId$: of(42),
              student$: of(buildStudent(42)),
            },
          },
          {
            provide: StorageService,
            useValue: {
              getPayload() {
                return null;
              },
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierEntryFooterComponent);
    component = fixture.componentInstance;

    entry = {
      id: 1,
      type: "dossier",
      additionalInformation: {
        ...buildAdditionalInformation(),
        Designation: "Anruf Eltern",
        Description: "Lorem ipsum",
        CreationDate: new Date(2000, 0, 23),
      },
      category: "Korrespondenz",
      canEdit: true,
    };
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
