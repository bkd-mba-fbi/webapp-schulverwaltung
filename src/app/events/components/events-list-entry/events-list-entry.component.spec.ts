import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildEventEntry } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsListEntryComponent } from "./events-list-entry.component";

describe("EventsListEntryComponent", () => {
  let component: EventsListEntryComponent;
  let fixture: ComponentFixture<EventsListEntryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsListEntryComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsListEntryComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    component.event = buildEventEntry(1);
    component.event.evaluationText = "Lorem ipsum";
  });

  it("renders entry without ratings column", () => {
    component.withRatings = false;

    fixture.detectChanges();
    expect(element.querySelector(".rating")).toBeNull();
    expect(element.textContent).not.toContain("Lorem ipsum");
  });

  it("renders entry with ratings column", () => {
    component.withRatings = true;

    fixture.detectChanges();
    expect(element.querySelector(".rating")).toBeTruthy();
    expect(element.textContent).toContain("Lorem ipsum");
  });
});
