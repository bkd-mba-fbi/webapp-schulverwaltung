import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Student } from "src/app/shared/models/student.model";
import { buildPerson, buildStudent } from "src/spec-builders";
import { Person } from "../../../models/person.model";
import { StudentDossierAddressComponent } from "./student-dossier-address.component";

describe("StudentDossierAddressComponent", () => {
  let fixture: ComponentFixture<StudentDossierAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDossierAddressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierAddressComponent);
  });

  describe("for student", () => {
    let student: Student;
    beforeEach(() => {
      student = buildStudent(123);
      student.AddressLine1 = "Spitalgasse 1";
      student.PostalCode = "3000";
      student.Location = "Bern";
      student.PhoneMobile = "+41 79 123 45 67";
    });

    it("renders full address", () => {
      student.AddressLine2 = "Postfach";
      student.PhonePrivate = "+41 31 123 45 67";
      student.DisplayEmail = "fritz@example.com";
      fixture.componentRef.setInput("student", student);

      fixture.detectChanges();
      expectText(
        "Spitalgasse 1 Postfach 3000 Bern +41 31 123 45 67 +41 79 123 45 67 fritz@example.com",
      );
    });

    it("renders address without optional fields", () => {
      fixture.componentRef.setInput("student", student);
      fixture.detectChanges();
      expectText("Spitalgasse 1 3000 Bern +41 79 123 45 67");
    });
  });

  describe("for person", () => {
    let student: Person;
    beforeEach(() => {
      student = buildPerson(123);
      student.AddressLine1 = "Spitalgasse 1";
      student.Zip = "3000";
      student.Location = "Bern";
      student.PhoneMobile = "+41 79 123 45 67";
    });

    it("renders full address", () => {
      student.AddressLine2 = "Postfach";
      student.PhonePrivate = "+41 31 123 45 67";
      student.DisplayEmail = "fritz@example.com";
      fixture.componentRef.setInput("student", student);

      fixture.detectChanges();
      expectText(
        "Spitalgasse 1 Postfach 3000 Bern +41 31 123 45 67 +41 79 123 45 67 fritz@example.com",
      );
    });

    it("renders address without optional fields", () => {
      fixture.componentRef.setInput("student", student);
      fixture.detectChanges();
      expectText("Spitalgasse 1 3000 Bern +41 79 123 45 67");
    });

    it("renders alternative email", () => {
      student.DisplayEmail = "fritz@example.com";
      student.Email2 = "alternative@example.com";
      fixture.componentRef.setInput("student", student);
      fixture.componentRef.setInput("emailProperty", "Email2");
      fixture.detectChanges();

      expectText(
        "Spitalgasse 1 3000 Bern +41 79 123 45 67 alternative@example.com",
      );
    });
  });

  function expectText(expectedText: string): void {
    const text = fixture.elementRef.nativeElement.textContent
      .trim()
      .replace(/\s{2,}/g, " ");
    expect(text).toBe(expectedText);
  }
});
