import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsStudentsComponent } from "./events-students.component";

describe("EventsStudentsComponent", () => {
  let component: EventsStudentsComponent;
  let fixture: ComponentFixture<EventsStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
