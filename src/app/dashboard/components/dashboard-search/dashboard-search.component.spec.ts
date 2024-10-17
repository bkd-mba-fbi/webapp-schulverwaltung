import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { DashboardSearchComponent } from "./dashboard-search.component";

describe("DashboardSearchComponent", () => {
  let component: DashboardSearchComponent;
  let fixture: ComponentFixture<DashboardSearchComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DashboardSearchComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    spyOn(router, "navigate");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("navigates to dossier with given id", async () => {
    const key = 12;
    await component.navigateToDossier(key);
    expect(router.navigate).toHaveBeenCalledWith([
      "dashboard",
      "student",
      key,
      "addresses",
    ]);
  });
});
