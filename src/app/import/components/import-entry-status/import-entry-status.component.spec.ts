import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportEntryStatusComponent } from "./import-entry-status.component";

describe("ImportEntryStatusComponent", () => {
  let component: ImportEntryStatusComponent;
  let fixture: ComponentFixture<ImportEntryStatusComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportEntryStatusComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportEntryStatusComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("renders a check mark without error message", () => {
    fixture.componentRef.setInput("errorMessage", null);
    fixture.detectChanges();

    expect(component.icon()).toEqual("check_circle");
    const icon = element.querySelector("i");
    expect(icon).not.toBeNull();
    expect(icon?.textContent).toContain("check_circle");
  });

  it("renders a cross with error message for an invalid entry", () => {
    fixture.componentRef.setInput("errorMessage", "Event not found");
    fixture.detectChanges();

    expect(component.icon()).toEqual("cancel");
    const icon = element.querySelector("i");
    expect(icon).not.toBeNull();
    expect(icon?.textContent).toContain("cancel");

    expect(element.textContent).toContain("Event not found");
  });
});
