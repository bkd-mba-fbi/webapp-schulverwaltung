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
    event.dateFrom = new Date(2000, 0, 23);
    event.dateTo = new Date(2000, 0, 24);
    fixture.componentRef.setInput("event", event);
  });

  describe(".withRatings", () => {
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

  describe(".withDate", () => {
    it("renders entry without ratings column", () => {
      fixture.componentRef.setInput("withDate", false);

      fixture.detectChanges();
      expect(element.querySelector(".date")).toBeNull();
      expect(element.textContent).not.toContain("23.01.2000–24.01.2000");
    });

    it("renders entry with ratings column", () => {
      fixture.componentRef.setInput("withDate", true);

      fixture.detectChanges();
      expect(element.querySelector(".date")).toBeTruthy();
      expect(element.textContent).toContain("23.01.2000–24.01.2000");
    });
  });
});
