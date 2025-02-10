import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierNavigationComponent } from "./student-dossier-navigation.component";

describe("StudentDossierNavigationComponent", () => {
  let fixture: ComponentFixture<StudentDossierNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierNavigationComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierNavigationComponent);

    const student = buildStudent(100);
    student.Birthdate = new Date(2000, 0, 23);

    fixture.componentRef.setInput("studentId", student.Id);
    fixture.componentRef.setInput("student", student);
    fixture.componentRef.setInput("returnParams", "foo=bar");
    fixture.detectChanges();
  });

  it("renders the avatar", () => {
    const avatar = fixture.debugElement.queryAll(By.css("bkd-avatar"));
    expect(avatar).not.toBeNull();
  });

  it("renders the student name", () => {
    const text = fixture.debugElement.nativeElement.textContent;
    expect(text).toContain("T. Tux");
  });

  it("renders the birthday", () => {
    const text = fixture.debugElement.nativeElement.textContent;
    expect(text).toContain("23.01.2000");
  });

  it("renders the gender", () => {
    const text = fixture.debugElement.nativeElement.textContent;
    expect(text).toContain("(F)");
  });

  it("renders the tabs", () => {
    const tabs = fixture.debugElement
      .queryAll(By.css("[role='tab']"))
      .map(({ nativeElement }) => nativeElement.textContent?.trim());
    expect(tabs).toEqual([
      "dossier.contact",
      "dossier.absences",
      "dossier.grades",
    ]);
  });
});
