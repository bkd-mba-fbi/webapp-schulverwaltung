import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportParseSubscriptionDetailsService } from "../../services/import-parse-subscription-details.service";
import { ImportUploadComponent } from "./import-upload.component";

describe("ImportUploadComponent", () => {
  let component: ImportUploadComponent;
  let fixture: ComponentFixture<ImportUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportUploadComponent],
        providers: [ImportParseSubscriptionDetailsService],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
