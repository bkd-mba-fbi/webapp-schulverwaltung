import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { DossierStateService } from "src/app/shared/services/dossier-state.service";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DossierContactComponent } from "./dossier-contact.component";

describe("DossierContactComponent", () => {
  let component: DossierContactComponent;
  let fixture: ComponentFixture<DossierContactComponent>;
  let stateServiceMock: DossierStateService;

  beforeEach(async () => {
    stateServiceMock = {
      dossierPage: signal("contact"),
      studentId$: of(123),
      student$: of(buildStudent(123)),
      loadingStudent$: of(false),
      legalRepresentatives$: of([]),
      loadingLegalRepresentatives$: of(false),
      apprenticeships$: of([]),
      loadingApprenticeships$: of(false),
      returnParams$: of(""),
      backlinkQueryParams$: of({}),
    } as unknown as DossierStateService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DossierContactComponent],
        providers: [
          { provide: DossierStateService, useValue: stateServiceMock },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
