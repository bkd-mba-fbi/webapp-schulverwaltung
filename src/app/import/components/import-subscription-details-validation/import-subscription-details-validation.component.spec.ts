import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportValidateSubscriptionDetailsService } from "../../services/import-validate-subscription-details.service";
import { ImportSubscriptionDetailsValidationComponent } from "./import-subscription-details-validation.component";

describe("ImportSubscriptionDetailsValidationComponent", () => {
  let component: ImportSubscriptionDetailsValidationComponent;
  let fixture: ComponentFixture<ImportSubscriptionDetailsValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportSubscriptionDetailsValidationComponent],
        providers: [ImportValidateSubscriptionDetailsService],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(
      ImportSubscriptionDetailsValidationComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
