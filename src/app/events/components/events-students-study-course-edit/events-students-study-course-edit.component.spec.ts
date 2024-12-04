import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsStudentsStudyCourseEditComponent } from "./events-students-study-course-edit.component";

describe("EventsStudentsStudyCourseEditComponent", () => {
  let component: EventsStudentsStudyCourseEditComponent;
  let fixture: ComponentFixture<EventsStudentsStudyCourseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsStudyCourseEditComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsStudyCourseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
