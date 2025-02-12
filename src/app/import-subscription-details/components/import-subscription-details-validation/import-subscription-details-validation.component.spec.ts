import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportSubscriptionDetailsStateService } from "../../services/import-subscription-details-state.service";
import { ImportSubscriptionDetailsValidationComponent } from "./import-subscription-details-validation.component";

describe("ImportSubscriptionDetailsValidationComponent", () => {
  let component: ImportSubscriptionDetailsValidationComponent;
  let fixture: ComponentFixture<ImportSubscriptionDetailsValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportSubscriptionDetailsValidationComponent],
        providers: [ImportSubscriptionDetailsStateService],
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
