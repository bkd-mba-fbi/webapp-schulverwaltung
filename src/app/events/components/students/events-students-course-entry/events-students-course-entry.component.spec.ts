import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentEntry } from "../../../services/events-students-state.service";
import { EventsStudentsCourseEntryComponent } from "./events-students-course-entry.component";

describe("EventsStudentsCourseEntryComponent", () => {
  let fixture: ComponentFixture<EventsStudentsCourseEntryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsCourseEntryComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsCourseEntryComponent);
    element = fixture.debugElement.nativeElement;

    fixture.componentRef.setInput("entry", {
      id: 1,
      name: "Doe Jane",
      email: "jane.doe@example.com",
      studyClass: "26a",
      company: "Coop Genossenschaft",
    } satisfies StudentEntry);
    fixture.componentRef.setInput("returnLink", "/events/current");
    fixture.detectChanges();
  });

  it("renders firstname/lastname with link to dossier including returnlink", () => {
    const link = element.querySelector<HTMLAnchorElement>("a.name");
    expect(link?.textContent).toContain("Doe Jane");
    expect(link?.href).toContain(
      "student/1/contact?returnparams=returnlink%3D%252Fevents%252Fcurrent",
    );
  });

  describe("study class", () => {
    it("does not render if course has only one class", () => {
      fixture.componentRef.setInput("multipleStudyClasses", false);
      fixture.detectChanges();
      expect(element.textContent).not.toContain("26a");
    });

    it("render if course has only one class", () => {
      fixture.componentRef.setInput("multipleStudyClasses", true);
      fixture.detectChanges();
      expect(element.textContent).toContain("26a");
    });
  });

  it("renders company", () => {
    expect(element.textContent).toContain("Coop Genossenschaft");
  });
});
