import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";
import { EventsStudentsStudyCourseEntryComponent } from "./events-students-study-course-entry.component";

describe("EventsStudentsStudyCourseEntryComponent", () => {
  let fixture: ComponentFixture<EventsStudentsStudyCourseEntryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsStudyCourseEntryComponent],
        providers: [StudyCourseSelectionService],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsStudyCourseEntryComponent);
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("entry", {
      id: 1,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      studyClasses: ["26a", "26c"],
      company: "Coop Genossenschaft",
      eventId: 1,
      eventDesignation: "English S3",
      status: "Angemeldet",
    });
    fixture.componentRef.setInput("selected", false);
    fixture.componentRef.setInput("returnLink", "/events/current");
    fixture.detectChanges();
  });

  it("renders firstname/lastname with link to dossier including returnlink", () => {
    const link = element.querySelector<HTMLAnchorElement>("a.name");
    expect(link?.textContent).toBe("Jane Doe");
    expect(link?.href).toContain(
      "student/1/absences?returnparams=returnlink%3D%252Fevents%252Fcurrent",
    );
  });

  it("renders the given status", () => {
    const status = element.querySelector("div.status");
    expect(status?.textContent).toBe("Angemeldet");
  });
});
