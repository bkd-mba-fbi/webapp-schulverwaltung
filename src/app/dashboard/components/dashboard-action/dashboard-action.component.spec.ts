import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { DashboardActionComponent } from "./dashboard-action.component";

describe("DashboardActionComponent", () => {
  let component: DashboardActionComponent;
  let fixture: ComponentFixture<DashboardActionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DashboardActionComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardActionComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("should render an action with label and icon", () => {
    component.label = "action.label";
    fixture.detectChanges();

    expect(element.textContent).toContain("action.label");
    expect(element.querySelector("svg")).not.toBeNull();
  });

  it("should render an action with label and count", () => {
    component.label = "action.label";
    component.count = 77;
    fixture.detectChanges();

    expect(element.textContent).toContain("action.label");
    expect(element.textContent).toContain("77");
    expect(element.querySelector("svg")).toBeNull();
  });
});
