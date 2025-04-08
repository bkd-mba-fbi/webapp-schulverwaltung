import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SubscriptionDetailFieldComponent } from "./subscription-detail-field.component";

describe("SubscriptionDetailFieldComponent", () => {
  let component: SubscriptionDetailFieldComponent;
  let fixture: ComponentFixture<SubscriptionDetailFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionDetailFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionDetailFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
