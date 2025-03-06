import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImportEntryValueComponent } from "./import-entry-value.component";

describe("ImportEntryValueComponent", () => {
  let component: ImportEntryValueComponent;
  let fixture: ComponentFixture<ImportEntryValueComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportEntryValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportEntryValueComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("renders a valid string value", () => {
    fixture.componentRef.setInput("value", "Lorem ipsum");
    fixture.componentRef.setInput("valid", true);

    fixture.detectChanges();
    expect(component.displayValue()).toBe("Lorem ipsum");
    expect(element.textContent).toContain("Lorem ipsum");
    expect(element.classList).not.toContain("invalid");
    const icon = element.querySelector("i");
    expect(icon).toBeNull();
  });

  it("renders a valid number value", () => {
    fixture.componentRef.setInput("value", 42);
    fixture.componentRef.setInput("valid", true);

    fixture.detectChanges();
    expect(component.displayValue()).toBe("42");
    expect(element.textContent).toContain("42");
    expect(element.classList).not.toContain("invalid");
    const icon = element.querySelector("i");
    expect(icon).toBeNull();
  });

  it("renders an invalid value", () => {
    fixture.componentRef.setInput("value", "Lorem ipsum");
    fixture.componentRef.setInput("valid", false);

    fixture.detectChanges();
    expect(component.displayValue()).toBe("Lorem ipsum");
    expect(element.textContent).toContain("Lorem ipsum");
    expect(element.classList).toContain("invalid");
    const icon = element.querySelector("i");
    expect(icon).not.toBeNull();
  });

  it("renders '–' for an empty string", () => {
    fixture.componentRef.setInput("value", "");
    fixture.componentRef.setInput("valid", true);

    fixture.detectChanges();
    expect(component.displayValue()).toBe("–");
    expect(element.textContent).toContain("–");
  });

  it("renders '–' for null", () => {
    fixture.componentRef.setInput("value", null);
    fixture.componentRef.setInput("valid", true);

    fixture.detectChanges();
    expect(component.displayValue()).toBe("–");
    expect(element.textContent).toContain("–");
  });

  it("renders '–' for undefined", () => {
    fixture.componentRef.setInput("value", undefined);
    fixture.componentRef.setInput("valid", true);

    fixture.detectChanges();
    expect(component.displayValue()).toBe("–");
    expect(element.textContent).toContain("–");
  });
});
