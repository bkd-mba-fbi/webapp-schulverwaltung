import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsStudentsHeaderComponent } from "./events-students-header.component";

describe("EventsStudentsHeaderComponent", () => {
  let component: EventsStudentsHeaderComponent;
  let fixture: ComponentFixture<EventsStudentsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsHeaderComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsHeaderComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.componentRef.setInput("title", "English S3");
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
