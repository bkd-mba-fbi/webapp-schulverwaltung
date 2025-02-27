import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImportProceedUploadDialogComponent } from "./import-proceed-upload-dialog.component";

describe("ImportProceedUploadDialogComponent", () => {
  let component: ImportProceedUploadDialogComponent;
  let fixture: ComponentFixture<ImportProceedUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportProceedUploadDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportProceedUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
