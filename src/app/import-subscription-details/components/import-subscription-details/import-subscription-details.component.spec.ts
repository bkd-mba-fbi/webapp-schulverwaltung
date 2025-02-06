import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportSubscriptionDetailsComponent } from "./import-subscription-details.component";

describe("ImportSubscriptionDetailsComponent", () => {
  let component: ImportSubscriptionDetailsComponent;
  let fixture: ComponentFixture<ImportSubscriptionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportSubscriptionDetailsComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportSubscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
