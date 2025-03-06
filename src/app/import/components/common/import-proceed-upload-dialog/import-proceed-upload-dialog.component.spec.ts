import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportProceedUploadDialogComponent } from "./import-proceed-upload-dialog.component";

describe("ImportProceedUploadDialogComponent", () => {
  let component: ImportProceedUploadDialogComponent;
  let fixture: ComponentFixture<ImportProceedUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportProceedUploadDialogComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportProceedUploadDialogComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("validCount", 1);
    fixture.componentRef.setInput("invalidCount", 1);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
