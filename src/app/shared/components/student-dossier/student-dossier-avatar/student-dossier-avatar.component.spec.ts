import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierAvatarComponent } from "./student-dossier-avatar.component";

describe("StudentDossierAvatarComponent", () => {
  let fixture: ComponentFixture<StudentDossierAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierAvatarComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierAvatarComponent);

    const student = buildStudent(100);
    student.Birthdate = new Date(2000, 0, 23);

    fixture.componentRef.setInput("studentId", student.Id);
    fixture.componentRef.setInput("student", student);
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
});
