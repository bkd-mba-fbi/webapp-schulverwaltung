import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CollapseComponent } from "./collapse.component";
import { buildTestModuleMetadata } from "../../../../spec-helpers";

describe("CollapseComponent", () => {
  let component: CollapseComponent;
  let fixture: ComponentFixture<CollapseComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [CollapseComponent],
      }),
    );
    fixture = TestBed.createComponent(CollapseComponent);
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
