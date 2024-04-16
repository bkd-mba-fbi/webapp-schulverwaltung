import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata, changeInput } from "src/spec-helpers";
import { expectText } from "src/specs/expectations";
import { buildCourse } from "../../../../../spec-builders";
import { DossierGradesService } from "../../../services/dossier-grades.service";
import { StorageService } from "../../../services/storage.service";
import { DossierGradesViewComponent } from "./dossier-grades-view.component";

describe("DossierGradesViewComponent", () => {
  let component: DossierGradesViewComponent;
  let fixture: ComponentFixture<DossierGradesViewComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DossierGradesViewComponent],
        providers: [
          DossierGradesService,
          StorageService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: "42" };
              },
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it("should render courses", () => {
    changeInput(component, "courses", [buildCourse(1)]);
    fixture.detectChanges();
    expect(debugElement.nativeElement.textContent?.trim()).toContain(
      "Physik-22a",
    );
  });

  it("should show message that indicates that there are no courses", () => {
    changeInput(component, "courses", []);
    fixture.detectChanges();

    expectText(debugElement, "message-no-courses", "dossier.no-courses");
  });
});
