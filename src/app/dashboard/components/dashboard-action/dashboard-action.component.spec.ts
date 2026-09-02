import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { DashboardActionComponent } from "./dashboard-action.component";

describe("DashboardActionComponent", () => {
  let fixture: ComponentFixture<DashboardActionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DashboardActionComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardActionComponent);
    element = fixture.debugElement.nativeElement;
  });

  it("renders an action with label and icon", () => {
    fixture.componentRef.setInput("label", "action.label");
    fixture.detectChanges();

    expect(element.textContent).toContain("action.label");
    expect(element.querySelector("svg")).not.toBeNull();
  });

  it("renders an action with label and count", () => {
    fixture.componentRef.setInput("label", "action.label");
    fixture.componentRef.setInput("count", 77);
    fixture.detectChanges();

    expect(element.textContent).toContain("action.label");
    expect(element.textContent).toContain("77");
    expect(element.querySelector("svg")).toBeNull();
  });
});
