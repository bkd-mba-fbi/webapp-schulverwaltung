import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ResettableInputComponent } from "./resettable-input.component";

describe("ResettableInputComponent", () => {
  let component: ResettableInputComponent;
  let fixture: ComponentFixture<ResettableInputComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResettableInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResettableInputComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("renders an empty input without clear button", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getInput()?.value).toBe("");
    expect(getClearButton()).toBeNull();
  });

  it("renders an input with the initial value and a clear button", () => {
    fixture.componentRef.setInput("value", "foo");
    fixture.detectChanges();
    expect(getInput()?.value).toBe("foo");
    expect(getClearButton()).not.toBeNull();
  });

  it("emits the new value if the input is changed", () => {
    fixture.detectChanges();
    const input = getInput()!;
    expect(input).not.toBeNull();

    input.value = "foo";
    input.dispatchEvent(new Event("input"));
    expect(component.value()).toBe("foo");

    fixture.detectChanges();
    expect(getClearButton()).not.toBeNull();
  });

  it("resets the value if the clear button is clicked", () => {
    fixture.componentRef.setInput("value", "foo");
    fixture.detectChanges();
    expect(component.value()).toBe("foo");

    const clearButton = getClearButton()!;
    expect(clearButton).not.toBeNull();
    clearButton.click();
    expect(component.value()).toBe("");

    fixture.detectChanges();
    expect(getClearButton()).toBeNull();
  });

  function getInput(): Option<HTMLInputElement> {
    return element.querySelector("input");
  }

  function getClearButton(): Option<HTMLButtonElement> {
    return element.querySelector("button.clear");
  }
});
