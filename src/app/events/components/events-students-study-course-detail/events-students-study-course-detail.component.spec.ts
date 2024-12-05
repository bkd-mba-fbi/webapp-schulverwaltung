import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EventsStudentsStudyCourseDetailComponent } from "./events-students-study-course-detail.component";

describe("EventsStudentsStudyCourseDetailComponent", () => {
  let component: EventsStudentsStudyCourseDetailComponent;
  let fixture: ComponentFixture<EventsStudentsStudyCourseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsStudentsStudyCourseDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsStudyCourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
