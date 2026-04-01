import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildPerson } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentContactLegalRepresentativeComponent } from "./student-contact-legal-representative.component";

describe("StudentContactLegalRepresentativeComponent", () => {
  let component: StudentContactLegalRepresentativeComponent;
  let fixture: ComponentFixture<StudentContactLegalRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentContactLegalRepresentativeComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      StudentContactLegalRepresentativeComponent,
    );
    component = fixture.componentInstance;
    component.person = buildPerson(123);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
