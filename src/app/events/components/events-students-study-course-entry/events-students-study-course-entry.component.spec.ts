import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsStudentsStudyCourseEntryComponent } from "./events-students-study-course-entry.component";

describe("EventsStudentsStudyCourseEntryComponent", () => {
  let fixture: ComponentFixture<EventsStudentsStudyCourseEntryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsStudyCourseEntryComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsStudyCourseEntryComponent);
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("entry", {
      id: 1,
      name: "Doe Jane",
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

  it("renders firstname/lastname with link to detail including returnlink", () => {
    const link = element.querySelector<HTMLAnchorElement>("a.name");
    expect(link?.textContent).toBe("Doe Jane");
    expect(link?.href).toContain(
      "student/1?returnparams=returnlink%3D%252Fevents%252Fcurrent",
    );
  });

  it("renders the given status", () => {
    const status = element.querySelector("div.status");
    expect(status?.textContent).toBe("Angemeldet");
  });
});
