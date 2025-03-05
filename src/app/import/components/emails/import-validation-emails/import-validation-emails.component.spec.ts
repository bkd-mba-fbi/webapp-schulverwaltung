import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImportValidationEmailsComponent } from "./import-validation-emails.component";

describe("ImportValidationEmailsComponent", () => {
  let component: ImportValidationEmailsComponent;
  let fixture: ComponentFixture<ImportValidationEmailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportValidationEmailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportValidationEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
