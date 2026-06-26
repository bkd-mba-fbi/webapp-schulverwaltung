import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Person } from "src/app/shared/models/person.model";
import { Apprenticeship } from "src/app/shared/services/student-profile.service";
import {
  buildApprenticeshipContract,
  buildApprenticeshipManager,
  buildJobTrainer,
  buildPerson,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentContactApprenticeshipComponent } from "./student-contact-apprenticeship.component";

describe("StudentContactApprenticeshipComponent", () => {
  let fixture: ComponentFixture<StudentContactApprenticeshipComponent>;
  let element: HTMLElement;
  let apprenticeship: Apprenticeship;
  let student: Person;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentContactApprenticeshipComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentContactApprenticeshipComponent);
    element = fixture.debugElement.nativeElement;

    apprenticeship = {
      apprenticeshipContract: buildApprenticeshipContract(123, 10, 20),
      jobTrainer: buildJobTrainer(10),
      apprenticeshipManager: buildApprenticeshipManager(20),
    };
    fixture.componentRef.setInput("apprenticeship", apprenticeship);

    student = buildPerson(42);
    fixture.componentRef.setInput("student", student);

    fixture.detectChanges();
  });

  describe("instructor email", () => {
    describe("email value", () => {
      it("renders email if present", () => {
        setCustom1("test@example.com");

        const link = getInstructorEmailSection().querySelector("a");
        expect(link).not.toBeNull();
        expect(link?.getAttribute("href")).toBe("mailto:test@example.com");
      });

      it("renders dash for non-email value", () => {
        setCustom1("Lorem ipsum dolor sit amet");

        const section = getInstructorEmailSection();
        expect(section.textContent).toContain("–");
        expect(section.querySelector("a")).toBeNull();
      });

      it("renders dash for null value", () => {
        setCustom1(null);

        const section = getInstructorEmailSection();
        expect(section.textContent).toContain("–");
        expect(section.querySelector("a")).toBeNull();
      });
    });

    describe("edit link", () => {
      describe("with instructorEmailEditLink and instructorEmailEditLabel", () => {
        beforeEach(() => {
          fixture.componentRef.setInput(
            "instructorEmailEditLink",
            "/edit-instructor-email",
          );
          fixture.componentRef.setInput(
            "instructorEmailEditLabel",
            "Edit instructor email",
          );
        });

        it("is rendered if present and value is valid email", () => {
          setCustom1("test@example.com");

          const editLink = getEditLink();
          expect(editLink).not.toBeNull();
          expect(editLink?.getAttribute("href")).toBe("/edit-instructor-email");
        });

        it("is rendered if present and value is empty string", () => {
          setCustom1("");

          const editLink = getEditLink();
          expect(editLink).not.toBeNull();
          expect(editLink?.getAttribute("href")).toBe("/edit-instructor-email");
        });

        it("is rendered if present and value is null", () => {
          setCustom1(null);

          const editLink = getEditLink();
          expect(editLink).not.toBeNull();
          expect(editLink?.getAttribute("href")).toBe("/edit-instructor-email");
        });

        it("is rendered if present and value is not a valid email", () => {
          setCustom1("Lorem ipsum dolor sit amet");

          const editLink = getEditLink();
          expect(editLink).not.toBeNull();
          expect(editLink?.getAttribute("href")).toBe("/edit-instructor-email");
        });
      });

      describe("without instructorEmailEditLink and instructorEmailEditLabel", () => {
        it("is not rendered if value is valid email", () => {
          setCustom1("test@example.com");
          expect(getEditLink()).toBeNull();
        });
      });
    });

    function setCustom1(value: unknown) {
      student.Custom1 = value;
      fixture.componentRef.setInput("student", { ...student });
      fixture.detectChanges();
    }

    function getEditLink() {
      const section = getInstructorEmailSection();
      const editLink = section.querySelector(
        "[aria-label='Edit instructor email']",
      );
      return editLink;
    }

    function getInstructorEmailSection(): HTMLDivElement {
      const section = Array.from(element.querySelectorAll("div")).find((div) =>
        div.textContent?.includes("shared.profile.instructor-email"),
      );
      expect(section).toBeDefined();
      return section as HTMLDivElement;
    }
  });
});
