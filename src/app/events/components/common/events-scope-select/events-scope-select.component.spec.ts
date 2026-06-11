import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsScopeSelectComponent } from "./events-scope-select.component";

describe("EventsScopeSelectComponent", () => {
  let component: EventsScopeSelectComponent;
  let fixture: ComponentFixture<EventsScopeSelectComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsScopeSelectComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsScopeSelectComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("value", "current");
    fixture.detectChanges();
  });

  it("renders both scope options with the selected one marked active", () => {
    const buttons = Array.from(element.querySelectorAll("button"));

    expect(buttons.map((b) => b.textContent?.trim())).toEqual([
      "events.scopes.current",
      "events.scopes.past",
    ]);

    expect(buttons[0].classList).toContain("active");
    expect(buttons[1].classList).not.toContain("active");
  });

  it("emits the new scope when the other option is clicked", () => {
    let emitted: ReadonlyArray<string> = [];
    component.value.subscribe((value) => (emitted = [...emitted, value]));

    const buttons = element.querySelectorAll("button");
    buttons[1].click();
    fixture.detectChanges();

    expect(component.value()).toBe("past");
    expect(emitted).toEqual(["past"]);

    const updatedButtons = element.querySelectorAll("button");
    expect(updatedButtons[0].classList).not.toContain("active");
    expect(updatedButtons[1].classList).toContain("active");
  });
});
