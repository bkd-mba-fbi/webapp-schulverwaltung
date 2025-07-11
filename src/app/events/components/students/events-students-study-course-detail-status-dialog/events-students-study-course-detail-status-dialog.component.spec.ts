import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EventsStudentsStudyCourseDetailStatusDialogComponent } from "./events-students-study-course-detail-status-dialog.component";

describe("EventsStudentsStudyCourseDetailStatusDialogComponent", () => {
  let component: EventsStudentsStudyCourseDetailStatusDialogComponent;
  let fixture: ComponentFixture<EventsStudentsStudyCourseDetailStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsStudentsStudyCourseDetailStatusDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      EventsStudentsStudyCourseDetailStatusDialogComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
