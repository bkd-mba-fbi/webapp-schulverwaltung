import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { SelectComponent } from "./select.component";

describe("SelectComponent", () => {
  let fixture: ComponentFixture<SelectComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({ imports: [SelectComponent] }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("options", [
      { Key: "apple", Value: "Apple" },
      { Key: "pear", Value: "Pear" },
    ]);
    fixture.componentRef.setInput("value", "pear");
    fixture.detectChanges();
  });

  it("renders the given options including an empty option", () => {
    const options = Array.from(element.querySelectorAll("option"));
    expect(options.map((o) => o.textContent?.trim())).toEqual([
      "",
      "Apple",
      "Pear",
    ]);
  });

  it("does not render an empty option with allowEmpty=false", () => {
    fixture.componentRef.setInput("allowEmpty", false);
    fixture.detectChanges();
    const options = Array.from(element.querySelectorAll("option"));
    expect(options.map((o) => o.textContent?.trim())).toEqual([
      "Apple",
      "Pear",
    ]);
  });

  it("uses a custom label for the empty option", () => {
    fixture.componentRef.setInput("emptyLabel", "None");
    fixture.detectChanges();
    const options = Array.from(element.querySelectorAll("option"));
    expect(options.map((o) => o.textContent?.trim())).toEqual([
      "None",
      "Apple",
      "Pear",
    ]);
  });

  it("selects the option matching the given value", async () => {
    await fixture.whenStable();

    const options = Array.from(element.querySelectorAll("option"));
    expect(options[0].selected).toBeFalse();
    expect(options[1].selected).toBeFalse();
    expect(options[2].selected).toBeTrue();
  });

  it("emits the selected value when changed", () => {
    const select = element.querySelector("select")!;
    select.selectedIndex = 1;
    select.dispatchEvent(new Event("change"));
    expect(fixture.componentInstance.value()).toBe("apple");
  });
});
