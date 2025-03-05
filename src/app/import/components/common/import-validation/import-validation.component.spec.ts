import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { ImportStateService } from "src/app/import/services/common/import-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportValidationComponent } from "./import-validation.component";

describe("ImportValidationComponent", () => {
  let fixture: ComponentFixture<ImportValidationComponent>;
  let element: HTMLElement;
  let stateService: ImportStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportValidationComponent],
      }),
    ).compileComponents();

    stateService = TestBed.inject(ImportStateService);

    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    fixture = TestBed.createComponent(ImportValidationComponent);
    element = fixture.debugElement.nativeElement;
  });

  it("renders subscription details import validation component", () => {
    stateService.importType.set("subscriptionDetails");
    fixture.detectChanges();

    expect(element.children.length).toBe(1);
    expect(
      element.querySelector("bkd-import-validation-subscription-details"),
    ).not.toBeNull();
  });

  it("renders emails import validation component", () => {
    stateService.importType.set("emails");
    fixture.detectChanges();

    expect(element.children.length).toBe(1);
    expect(
      element.querySelector("bkd-import-validation-emails"),
    ).not.toBeNull();
  });
});
