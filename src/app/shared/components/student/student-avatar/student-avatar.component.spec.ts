import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { StudentWithClassRegistration } from "src/app/shared/models/student.model";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentAvatarComponent } from "./student-avatar.component";

describe("StudentAvatarComponent", () => {
  let fixture: ComponentFixture<StudentAvatarComponent>;
  let element: HTMLElement;
  let student: StudentWithClassRegistration;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentAvatarComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentAvatarComponent);

    student = {
      ...buildStudent(100),
      Birthdate: new Date(2000, 0, 23),
      ClassRegistrations: [
        {
          Id: 1,
          IsActive: true,
          NumberStudyClass: "26b",
        },
      ],
    };
    student.Birthdate = new Date(2000, 0, 23);

    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("studentId", student.Id);
    fixture.componentRef.setInput("student", student);
    fixture.detectChanges();
  });

  it("renders the avatar", () => {
    const avatar = fixture.debugElement.queryAll(By.css("bkd-avatar"));
    expect(avatar).not.toBeNull();
  });

  it("renders the student name", () => {
    const text = element.textContent;
    expect(text).toContain("T. Tux");
  });

  it("renders the birthday", () => {
    const text = element.textContent;
    expect(text).toContain("23.01.2000");
  });

  it("renders the gender", () => {
    const text = element.textContent;
    expect(text).toContain("(F)");
  });

  describe("study classes", () => {
    it("renders no class", () => {
      fixture.componentRef.setInput("student", {
        ...student,
        ClassRegistrations: [],
      });
      fixture.detectChanges();
      const studyClasses = fixture.debugElement.query(By.css(".study-classes"));
      expect(studyClasses).toBeNull();
    });

    it("renders single class", () => {
      fixture.componentRef.setInput("student", {
        ...student,
        ClassRegistrations: [
          {
            Id: 1,
            IsActive: true,
            NumberStudyClass: "26b",
          },
        ],
      });
      fixture.detectChanges();
      const studyClasses = element.querySelector(".study-classes");
      expect(studyClasses?.textContent).toBe("26b");
    });

    it("renders multiple classes", () => {
      fixture.componentRef.setInput("student", {
        ...student,
        ClassRegistrations: [
          {
            Id: 1,
            IsActive: true,
            NumberStudyClass: "26b",
          },
          {
            Id: 2,
            IsActive: true,
            NumberStudyClass: "BVS2026a",
          },
        ],
      });
      fixture.detectChanges();
      const studyClasses = element.querySelector(".study-classes");
      expect(studyClasses?.textContent).toBe("26b, BVS2026a");
    });

    it("renders only active classes", () => {
      fixture.componentRef.setInput("student", {
        ...student,
        ClassRegistrations: [
          {
            Id: 1,
            IsActive: true,
            NumberStudyClass: "26b",
          },
          {
            Id: 2,
            IsActive: false,
            NumberStudyClass: "BVS2026a",
          },
        ],
      });
      fixture.detectChanges();
      const studyClasses = element.querySelector(".study-classes");
      expect(studyClasses?.textContent).toBe("26b");
    });
  });
});
