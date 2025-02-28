import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { SubscriptionDetailImportEntry } from "../../services/import-validate-subscription-details.service";
import { EventNotFoundError } from "../../utils/subscription-details/error";
import { ImportEntryStatusComponent } from "./import-entry-status.component";

describe("ImportEntryStatusComponent", () => {
  let component: ImportEntryStatusComponent;
  let fixture: ComponentFixture<ImportEntryStatusComponent>;
  let element: HTMLElement;
  let entry: SubscriptionDetailImportEntry;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportEntryStatusComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportEntryStatusComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    entry = {
      validationStatus: "validating",
      importStatus: null,
      entry: {
        eventId: 10,
        personId: 100,
        personEmail: null,
        subscriptionDetailId: 1000,
        value: "Lorem ipsum",
      },
      data: {},
      validationError: null,
      importError: null,
    };
  });

  it("renders a check mark without error message for a valid entry", () => {
    entry.validationStatus = "valid";
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();

    expect(component.icon()).toEqual("check_circle");
    const icon = element.querySelector("i");
    expect(icon).not.toBeNull();
    expect(icon?.textContent).toContain("check_circle");

    expect(component.errorMessage()).toBeNull();
  });

  it("renders a cross with error message for an invalid entry", () => {
    entry.validationStatus = "invalid";
    entry.validationError = new EventNotFoundError();
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();

    expect(component.icon()).toEqual("cancel");
    const icon = element.querySelector("i");
    expect(icon).not.toBeNull();
    expect(icon?.textContent).toContain("cancel");

    expect(component.errorMessage()).toBe(
      "import.validation.errors.EventNotFoundError",
    );
    expect(element.textContent).toContain(
      "import.validation.errors.EventNotFoundError",
    );
  });
});
