import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudyCourseSelectionService } from "../../services/study-course-selection.service";
import { EventsStudentsStudyCourseListComponent } from "./events-students-study-course-list.component";

describe("EventsStudentsStudyCourseListComponent", () => {
  let component: EventsStudentsStudyCourseListComponent;
  let fixture: ComponentFixture<EventsStudentsStudyCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsStudyCourseListComponent],
        providers: [StudyCourseSelectionService],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsStudyCourseListComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.componentRef.setInput("title", "Berufsmaturität 2");
    fixture.componentRef.setInput("count", 0);
    fixture.componentRef.setInput("entries", []);
    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "name",
      ascending: true,
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
