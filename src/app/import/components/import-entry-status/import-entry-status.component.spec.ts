import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportEntryStatusComponent } from "./import-entry-status.component";

describe("ImportEntryStatusComponent", () => {
  let component: ImportEntryStatusComponent;
  let fixture: ComponentFixture<ImportEntryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportEntryStatusComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportEntryStatusComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("entry", {
      validationStatus: "validating",
      importStatus: null,
      entry: {
        eventId: 10,
        personId: 100,
        subscriptionDetailId: 1000,
        value: "Lorem ipsum",
      },
      validationError: null,
      importError: null,
    });

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
