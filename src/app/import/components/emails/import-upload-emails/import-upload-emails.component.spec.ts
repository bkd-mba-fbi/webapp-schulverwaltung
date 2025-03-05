import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImportUploadEmailsComponent } from "./import-upload-emails.component";

describe("ImportUploadEmailsComponent", () => {
  let component: ImportUploadEmailsComponent;
  let fixture: ComponentFixture<ImportUploadEmailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportUploadEmailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportUploadEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
