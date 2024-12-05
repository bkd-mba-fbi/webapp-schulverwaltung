import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsStudentsCourseListComponent } from "./events-students-course-list.component";

describe("EventsStudentsCourseListComponent", () => {
  let component: EventsStudentsCourseListComponent;
  let fixture: ComponentFixture<EventsStudentsCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsCourseListComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsCourseListComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.componentRef.setInput("title", "English S3");
    fixture.componentRef.setInput("count", 0);
    fixture.componentRef.setInput("entries", []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
