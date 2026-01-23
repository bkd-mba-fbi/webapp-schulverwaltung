import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StudyCoursesComponent } from "./study-courses.component";

describe("StudyCoursesComponent", () => {
  let component: StudyCoursesComponent;
  let fixture: ComponentFixture<StudyCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyCoursesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
