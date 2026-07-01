import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { CaretComponent } from "./caret.component";

describe("CaretComponent", () => {
  let fixture: ComponentFixture<CaretComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [CaretComponent],
      }),
    );
    fixture = TestBed.createComponent(CaretComponent);
    element = fixture.debugElement.nativeElement;
  });

  it("should show expand more icon by default", () => {
    fixture.detectChanges();

    expect(element.textContent).toContain("expand_more");
  });

  it("should show expand less icon if expanded", () => {
    fixture.componentRef.setInput("expanded", true);
    fixture.detectChanges();

    expect(element.textContent).toContain("expand_less");
  });

  it("should show expand more icon if not expanded", () => {
    fixture.componentRef.setInput("expanded", false);
    fixture.detectChanges();

    expect(element.textContent).toContain("expand_more");
  });
});
