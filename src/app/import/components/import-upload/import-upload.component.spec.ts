import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportSubscriptionDetailsService } from "../../services/import-subscription-details.service";
import { ImportUploadComponent } from "./import-upload.component";

describe("ImportUploadComponent", () => {
  let component: ImportUploadComponent;
  let fixture: ComponentFixture<ImportUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportUploadComponent],
        providers: [ImportSubscriptionDetailsService],
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
