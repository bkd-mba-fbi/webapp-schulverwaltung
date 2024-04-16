import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { CaretComponent } from "./caret.component";

describe("CaretComponent", () => {
  let component: CaretComponent;
  let fixture: ComponentFixture<CaretComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [CaretComponent],
      }),
    );
    fixture = TestBed.createComponent(CaretComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("should show expand more icon by default", () => {
    fixture.detectChanges();

    expect(element.textContent).toContain("expand_more");
  });

  it("should show expand less icon if expanded", () => {
    component.expanded = true;
    fixture.detectChanges();

    expect(element.textContent).toContain("expand_less");
  });

  it("should show expand more icon if not expanded", () => {
    component.expanded = false;
    fixture.detectChanges();

    expect(element.textContent).toContain("expand_more");
  });
});
