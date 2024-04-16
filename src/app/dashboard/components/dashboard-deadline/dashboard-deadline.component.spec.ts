import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { DashboardDeadlineComponent } from "./dashboard-deadline.component";

describe("DashboardDeadlineComponent", () => {
  let component: DashboardDeadlineComponent;
  let fixture: ComponentFixture<DashboardDeadlineComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DashboardDeadlineComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardDeadlineComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("should render the component", () => {
    component.count = 33;
    fixture.detectChanges();
    expect(element.textContent).toContain("dashboard.actions.deadline: 33");
  });
});
