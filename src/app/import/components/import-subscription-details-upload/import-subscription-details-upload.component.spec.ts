import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportSubscriptionDetailsUploadComponent } from "./import-subscription-details-upload.component";

describe("ImportSubscriptionDetailsUploadComponent", () => {
  let component: ImportSubscriptionDetailsUploadComponent;
  let fixture: ComponentFixture<ImportSubscriptionDetailsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportSubscriptionDetailsUploadComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportSubscriptionDetailsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
