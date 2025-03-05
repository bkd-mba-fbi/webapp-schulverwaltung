import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { ImportStateService } from "src/app/import/services/common/import-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportUploadComponent } from "./import-upload.component";

describe("ImportUploadComponent", () => {
  let fixture: ComponentFixture<ImportUploadComponent>;
  let element: HTMLElement;
  let stateService: ImportStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportUploadComponent],
      }),
    ).compileComponents();

    stateService = TestBed.inject(ImportStateService);

    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    fixture = TestBed.createComponent(ImportUploadComponent);
    element = fixture.debugElement.nativeElement;
  });

  it("renders subscription details import upload component", () => {
    stateService.importType.set("subscriptionDetails");
    fixture.detectChanges();

    expect(element.children.length).toBe(1);
    expect(
      element.querySelector("bkd-import-upload-subscription-details"),
    ).not.toBeNull();
  });

  it("renders emails import upload component", () => {
    stateService.importType.set("emails");
    fixture.detectChanges();

    expect(element.children.length).toBe(1);
    expect(element.querySelector("bkd-import-upload-emails")).not.toBeNull();
  });
});
