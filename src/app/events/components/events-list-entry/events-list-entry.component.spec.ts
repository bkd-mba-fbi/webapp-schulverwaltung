import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildEventEntry } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsListEntryComponent } from "./events-list-entry.component";

describe("EventsListEntryComponent", () => {
  let fixture: ComponentFixture<EventsListEntryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsListEntryComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsListEntryComponent);
    element = fixture.debugElement.nativeElement;

    const event = buildEventEntry(1);
    event.evaluationText = "Lorem ipsum";
    fixture.componentRef.setInput("event", event);
  });

  it("renders entry without ratings column", () => {
    fixture.componentRef.setInput("withRatings", false);

    fixture.detectChanges();
    expect(element.querySelector(".rating")).toBeNull();
    expect(element.textContent).not.toContain("Lorem ipsum");
  });

  it("renders entry with ratings column", () => {
    fixture.componentRef.setInput("withRatings", true);

    fixture.detectChanges();
    expect(element.querySelector(".rating")).toBeTruthy();
    expect(element.textContent).toContain("Lorem ipsum");
  });
});
